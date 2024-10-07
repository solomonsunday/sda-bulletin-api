import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateBulletinDto, UpdateBulletinDto } from './dto/bulletin.dto';
import { AwsRepositoryService } from 'src/common/aws-repository/aws-repository.service';
import {
  BulletinStatusEnum,
  BulletinStatusType,
  IBulletin,
  QueryParamDto,
} from './entities/bulletin.interface';
import { EntityName } from 'src/common/enum';
import { IAnnouncement } from '../announcement/entities/announcement.interface';
import { CachingService } from 'src/common/caching/caching.service';
import { IUser } from '../auth/entities/auth.interface';

@Injectable()
export class BulletinService {
  constructor(
    private awsRepositoryService: AwsRepositoryService,
    private cachingService: CachingService,
  ) {}

  async createBulletin(user: IUser, createBulletinDto: CreateBulletinDto) {
    const { Result: createdBulletin } =
      await this.awsRepositoryService.runPutCommand<IBulletin>({
        Item: {
          id: uuidv4(),
          entityName: 'bulletin',
          createdDate: new Date().toISOString(),
          status: BulletinStatusEnum.DRAFT,
          createdBy: user.id,
          ...createBulletinDto,
        },
      });
    await this.cachingService.setDataToCache(
      createdBulletin.id,
      createdBulletin,
    );
    return {
      message: 'bulletin created successfully',
      data: createdBulletin,
    };
  }

  async findAllBulletin({
    limit,
    next_page_token,
    start_date,
    end_date,
    current_date,
    // search,
  }: QueryParamDto) {
    const queryParam: any = {
      IndexName: 'entityName-createdDate-index',
      KeyConditionExpression: 'entityName = :entityName',
      ExpressionAttributeValues: {
        ':entityName': EntityName.BULLETIN,
      },
    };
    if (limit) {
      queryParam.Limit = +limit;
    }
    if (next_page_token) {
      queryParam.ExclusiveStartKey = JSON.parse(next_page_token);
    }

    if (start_date && end_date) {
      queryParam.FilterExpression = 'startDate BETWEEN :startDate AND :endDate';
      queryParam.ExpressionAttributeValues = {
        ...queryParam.ExpressionAttributeValues,
        ':startDate': start_date,
        ':endDate': end_date,
      };
    }

    if (current_date) {
      queryParam.FilterExpression =
        '#startDate <= :currentDate AND  #endDate >= :currentDate';

      queryParam.ExpressionAttributeNames = {
        ...queryParam.ExpressionAttributeNames,
        '#startDate': 'startDate',
        '#endDate': 'endDate',
      };

      queryParam.ExpressionAttributeValues = {
        ...queryParam.ExpressionAttributeValues,
        ':currentDate': current_date,
      };
    }

    const response =
      await this.awsRepositoryService.runQueryCommand<IBulletin[]>(queryParam);

    const paginationToken = response.LastEvaluatedKey
      ? JSON.stringify(response.LastEvaluatedKey)
      : null;
    const bulletins = response.Results;

    const announcementIds = bulletins
      .map((bulletin) => bulletin.announcementIds)
      .flat();
    const announcements =
      await this.getBulletinsAnnouncementInBatch(announcementIds);

    return {
      bulletins: bulletins.map((bulletin) => {
        return {
          ...bulletin,
          announcements: announcements.filter((announcement) =>
            bulletin.announcementIds?.includes(announcement.id),
          ),
        };
      }),
      paginationToken,
    };
  }

  async getBulletinById(bulletinId: string) {
    const bulletin = await this.helpGetBulletinById(bulletinId);
    const announcements = await this.getBulletinsAnnouncementInBatch(
      bulletin.announcementIds,
    );
    bulletin.announcements = announcements;

    return bulletin;
  }

  async getBulletinsAnnouncementInBatch(announcementIds: string[]) {
    if (announcementIds.length === 0) return [];
    const announcementQuery =
      [...new Set(announcementIds)].map((announcementId) => {
        if (announcementId)
          return { id: announcementId, entityName: EntityName.ANNOUNCEMENT };
      }) || [];
    const { Responses } = await this.awsRepositoryService.runBatchGetCommand({
      RequestItems: {
        ['ogba-church-bulletin-development']: {
          Keys: announcementQuery,
        },
      },
    });

    return Responses['ogba-church-bulletin-development'] as IAnnouncement[];
  }

  async updateBulletin(
    id: string,
    user: IUser,
    updateBulletinDto: UpdateBulletinDto,
  ) {
    const foundBulletin = await this.helpGetBulletinById(id);
    const bulletinObject = Object.assign({}, foundBulletin, {
      updatedBy: user?.id,
      ...updateBulletinDto,
    });
    const { Result: bulletin } = await this.awsRepositoryService.runPutCommand({
      Item: { ...bulletinObject },
    });
    await this.cachingService.setDataToCache(id, bulletin);
    return {
      message: 'updated successfully',
      data: bulletin,
    };
  }

  // https://stackoverflow.com/questions/48653365/update-attribute-timestamp-reserved-word
  async updateBulletinStatus({
    bulletinId,
    status,
    currentUser,
  }: {
    bulletinId: string;
    status: BulletinStatusType;
    currentUser: IUser;
  }) {
    await this.helpGetBulletinById(bulletinId);

    const { Attributes } = await this.awsRepositoryService.runUpdateCommand({
      Key: { id: bulletinId, entityName: EntityName.BULLETIN },
      UpdateExpression:
        'SET #status_ = :status, updatedDate = :updatedDate, updatedBy = :updatedBy',
      ExpressionAttributeNames: { '#status_': 'status' },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedDate': new Date().toISOString(),
        ':updatedBy': currentUser.id,
      },
    });
    await this.cachingService.setDataToCache(bulletinId, Attributes);
    return 'Updated successfully!';
  }

  async deleteBulletin(bulletinId: string) {
    await this.helpGetBulletinById(bulletinId);
    await this.awsRepositoryService.runDeleteCommand({
      Key: { id: bulletinId, entityName: 'bulletin' },
    });
    await this.cachingService.deleteDataFromCache(bulletinId);
    return 'deleted successfully!';
  }

  private async helpGetBulletinById(bulletinId: string): Promise<IBulletin> {
    let bulletin: IBulletin = null;
    const cacheData =
      await this.cachingService.getCahedData<IBulletin>(bulletinId);
    bulletin = cacheData ? { ...cacheData } : null;
    if (!cacheData) {
      const result = await this.awsRepositoryService.runGetCommand<IBulletin>({
        Key: { id: bulletinId, entityName: EntityName.BULLETIN },
      });
      bulletin = result.Result;
    }
    if (!bulletin) {
      throw new NotFoundException('bulletin with this Id does not exist!');
    }
    await this.cachingService.setDataToCache(bulletinId, bulletin);
    return bulletin;
  }
}
