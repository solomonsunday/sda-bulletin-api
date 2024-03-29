import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateBulletinDto, UpdateBulletinDto } from './dto/bulletin.dto';
import { AwsRepositoryService } from 'src/common/aws-repository/aws-repository.service';
import { EnvironmentConfig } from 'src/common';
import {
  BulletinStatusEnum,
  BulletinStatusType,
  IBulletin,
  QueryParamDto,
} from './entities/bulletin.interface';
import { EntityName } from 'src/common/enum';
import { IAnnouncement } from '../announcement/entities/announcement.interface';
import { CachingService } from 'src/common/caching/caching.service';
import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
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
        TableName: EnvironmentConfig.TABLE_NAME,
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
    search,
  }: QueryParamDto) {
    const queryParam: QueryCommandInput = {
      TableName: EnvironmentConfig.TABLE_NAME,
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

    const response =
      await this.awsRepositoryService.runQueryCommand<IBulletin>(queryParam);

    const paginationToken = response.LastEvaluatedKey
      ? JSON.stringify(response.LastEvaluatedKey)
      : null;
    const bulletins = response.Items;

    return { bulletins, paginationToken };
  }

  async getBulletinById(bulletinId: string) {
    const bulletin = await this.helpGetBulletinById(bulletinId);
    if (bulletin?.announcementIds) {
      const announcementQuery =
        bulletin.announcementIds?.map((announcementId) => {
          return { id: announcementId, entityName: EntityName.ANNOUNCEMENT };
        }) || [];

      const { Responses } = await this.awsRepositoryService.runBatchGetCommand({
        RequestItems: {
          [EnvironmentConfig.TABLE_NAME]: {
            Keys: announcementQuery,
          },
        },
      });

      const announcements = Responses[
        EnvironmentConfig.TABLE_NAME
      ] as IAnnouncement[];
      bulletin.announcements = announcements;
    }

    return bulletin;
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
      TableName: EnvironmentConfig.TABLE_NAME,
      Item: { ...bulletinObject },
    });
    await this.cachingService.setDataToCache(id, bulletin);
    return {
      message: 'updated successfully',
      data: bulletin,
    };
  }

  // https://stackoverflow.com/questions/48653365/update-attribute-timestamp-reserved-word
  async updateStatus({
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
      TableName: EnvironmentConfig.TABLE_NAME,
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
      TableName: EnvironmentConfig.TABLE_NAME,
      Key: { id: bulletinId, entityName: 'bulletin' },
    });
    await this.cachingService.deleteDataFromCache(bulletinId);
    return 'deleted successfully!';
  }

  private async helpGetBulletinById(bulletinId: string): Promise<IBulletin> {
    let bulletin: IBulletin = null;
    let cacheData =
      await this.cachingService.getCahedData<IBulletin>(bulletinId);
    bulletin = cacheData ? { ...cacheData } : null;
    if (!cacheData) {
      const result = await this.awsRepositoryService.runGetCommand<IBulletin>({
        TableName: EnvironmentConfig.TABLE_NAME,
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
