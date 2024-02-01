import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { SignUpDto } from '../dto/auth.dto';
import { AwsRepositoryService } from 'src/common/aws-repository/aws-repository.service';
import { EnvironmentConfig } from 'src/common';
import { UnprocessableEntityException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private awsRepositoryService: AwsRepositoryService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: EnvironmentConfig.TOP_SECRET,
    });
  }

  async validate(payload: SignUpDto) {
    const { Items: users } = await this.awsRepositoryService.runQueryCommand({
      TableName: EnvironmentConfig.TABLE_NAME,
      IndexName: 'entityName-createdDate-index',
      KeyConditionExpression: 'entityName = :entityName',
      FilterExpression: 'userName = :userName',
      ExpressionAttributeValues: {
        ':entityName': 'user',
        ':userName': payload.userName,
      },
    });
    const user = users.at(0);
    if (user) {
      throw new UnprocessableEntityException('Username already registered!');
    }
    return user;
  }
}
