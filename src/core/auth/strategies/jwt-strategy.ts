import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { EnvironmentConfig } from 'src/common';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { IUser } from '../entities/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: EnvironmentConfig.APP_JWT_SECRET,
    });
  }

  async validate(payload: { id: string; iat: number; exp: number }) {
    const user: IUser = await this.authService.getUserById(payload.id);

    delete user.password;
    return user;
  }
}
