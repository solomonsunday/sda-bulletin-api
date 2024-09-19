import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/announcement.dto';
import { AwsRepositoryService } from 'src/common/aws-repository/aws-repository.service';
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
        // TableName: 'ogba-church-bulletin-development',
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
        // TableName: 'ogba-church-bulletin-development',
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
        // TableName: 'ogba-church-bulletin-development',
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
        // TableName: 'ogba-church-bulletin-development',
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
      // TableName: 'ogba-church-bulletin-development',
      Key: { id, entityName: EntityName.ANNOUNCEMENT },
    });
    return 'deleted successfully!';
  }
}
