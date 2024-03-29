import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/announcement.dto';
import { AwsRepositoryService } from 'src/common/aws-repository/aws-repository.service';
import { EnvironmentConfig } from 'src/common';
import { IAnnouncement } from './entities/announcement.interface';
import { v4 as uuidv4 } from 'uuid';
import { EntityName } from 'src/common/enum';
import { IUser } from '../auth/entities/auth.interface';

@Injectable()
export class AnnouncementService {
  constructor(private awsRepositoryService: AwsRepositoryService) {}

  async createAnnouncement(
    currentUser: IUser,
    createAnnouncementDto: CreateAnnouncementDto,
  ) {
    const { Result: createdAnnouncement } =
      await this.awsRepositoryService.runPutCommand<IAnnouncement>({
        TableName: EnvironmentConfig.TABLE_NAME,
        Item: {
          id: uuidv4(),
          entityName: EntityName.ANNOUNCEMENT,
          createdDate: new Date().toISOString(),
          createdBy: currentUser.id,
          ...createAnnouncementDto,
        },
      });
    return {
      message: 'announcement  created successfully',
      data: createdAnnouncement,
    };
  }

  async getAnnouncements() {
    const { Items: announcements } =
      await this.awsRepositoryService.runQueryCommand({
        TableName: EnvironmentConfig.TABLE_NAME,
        IndexName: 'entityName-createdDate-index',
        KeyConditionExpression: 'entityName = :entityName',
        ExpressionAttributeValues: {
          ':entityName': EntityName.ANNOUNCEMENT,
        },
      });
    return announcements;
  }

  async getAnnounceById(id: string) {
    const { Result: bulletin } =
      await this.awsRepositoryService.runGetCommand<IAnnouncement>({
        TableName: EnvironmentConfig.TABLE_NAME,
        Key: { id, entityName: EntityName.ANNOUNCEMENT },
      });
    if (!bulletin) {
      throw new NotFoundException('announcement with this Id does not exist!');
    }
    return bulletin;
  }

  async updateAnnouncement(
    id: string,
    currentUser: IUser,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    const foundAnnouncement = await this.getAnnounceById(id);
    const announcementObject = Object.assign({}, foundAnnouncement, {
      updatedBy: currentUser.id,
      ...updateAnnouncementDto,
    });
    const { Result: announcement } =
      await this.awsRepositoryService.runPutCommand({
        TableName: EnvironmentConfig.TABLE_NAME,
        Item: { ...announcementObject },
      });
    return {
      message: '',
      data: announcement,
    };
  }

  async deleteAnnouncement(id: string) {
    await this.getAnnounceById(id); // check if exists
    await this.awsRepositoryService.runDeleteCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      Key: { id, entityName: EntityName.ANNOUNCEMENT },
    });
    return 'deleted successfully!';
  }
}
