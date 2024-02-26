import { EnvironmentConfig } from 'src/common';
import { AwsRepositoryService } from 'src/common/aws-repository/aws-repository.service';

export class AuthHeper {
  constructor(private readonly awsRepositoryService: AwsRepositoryService) {}

  async getUserByToken(userId: string): Promise<any> {
    try {
      const { Items: users } = await this.awsRepositoryService.runQueryCommand({
        TableName: EnvironmentConfig.TABLE_NAME,
        IndexName: 'entityName-createdDate-index',
        KeyConditionExpression: 'entityName = :entityName',
        FilterExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':entityName': 'user',
          ':id': userId,
        },
      });
      const currentUser = users.at(0);
      console.log(currentUser, 'user-at auth helper');
      return currentUser;
    } catch (error) {
      console.log(error);
    }
  }
}
