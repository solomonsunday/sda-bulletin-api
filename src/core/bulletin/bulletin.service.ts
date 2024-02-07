import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateBulletinDto, UpdateBulletinDto } from './dto/bulletin.dto';
import { AwsRepositoryService } from 'src/common/aws-repository/aws-repository.service';
import { EnvironmentConfig } from 'src/common';
import { IBulletin } from './entities/bulletin.interface';

@Injectable()
export class BulletinService {
  constructor(private awsRepositoryService: AwsRepositoryService) {}

  async createBulletin(createBulletinDto: CreateBulletinDto) {
    const { Result: createdBulletin } =
      await this.awsRepositoryService.runPutCommand<IBulletin>({
        TableName: EnvironmentConfig.TABLE_NAME,
        Item: {
          id: uuidv4(),
          entityName: 'bulletin',
          createdDate: new Date().toISOString(),
          ...createBulletinDto,
        },
      });
    return {
      message: 'bulletin created successfully',
      data: createdBulletin,
    };
  }

  async findAllBulletin() {
    const { Items: bulletins } =
      await this.awsRepositoryService.runQueryCommand({
        TableName: EnvironmentConfig.TABLE_NAME,
        IndexName: 'entityName-createdDate-index',
        KeyConditionExpression: 'entityName = :entityName',
        ExpressionAttributeValues: {
          ':entityName': 'bulletin',
        },
      });
    return bulletins;
  }

  async getBulletinById(id: string) {
    const { Result: bulletin } =
      await this.awsRepositoryService.runGetCommand<IBulletin>({
        TableName: EnvironmentConfig.TABLE_NAME,
        Key: { id, entityName: 'bulletin' },
      });
    if (!bulletin) {
      throw new NotFoundException('bulletin with this Id does not exist!');
    }
    return bulletin;
  }

  async updateBulletin(id: string, updateBulletinDto: UpdateBulletinDto) {
    const foundBulletin = await this.getBulletinById(id);
    const bulletinObject = Object.assign({}, foundBulletin, {
      ...updateBulletinDto,
    });
    const { Result: bulletin } = await this.awsRepositoryService.runPutCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      Item: { ...bulletinObject },
    });
    return {
      message: 'updated successfully',
      data: bulletin,
    };
  }

  async deleteBulletin(id: string) {
    await this.getBulletinById(id);
    await this.awsRepositoryService.runDeleteCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      Key: { id, entityName: 'bulletin' },
    });
    return 'deleted successfully!';
  }
}
