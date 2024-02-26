import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { EnvironmentConfig } from 'src/common';
import { UnauthorizedException } from '@nestjs/common';
import { AuthHeper } from '../auth.helper';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authHelper: AuthHeper) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: EnvironmentConfig.JWT_SECRET,
    });
  }

  async validate(
    payload: { userId: string; iat: number; exp: number },
    done: VerifiedCallback,
  ) {
    // const { Items: users } = await this.awsRepositoryService.runQueryCommand({
    //   TableName: EnvironmentConfig.TABLE_NAME,
    //   IndexName: 'entityName-createdDate-index',
    //   KeyConditionExpression: 'entityName = :entityName',
    //   FilterExpression: 'userName = :userName',
    //   ExpressionAttributeValues: {
    //     ':entityName': 'user',
    //     ':userName': payload.userName,
    //   },
    // });
    // const user = users.at(0);
    try {
      console.log('got here');
      if (!payload.userId) {
        throw new UnauthorizedException();
      }
      const user = await this.authHelper.getUserByToken(payload.userId);
      console.log(user, 'user-at jwt srategy');
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
