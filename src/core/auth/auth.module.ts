import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentConfig } from 'src/common';
require('dotenv').config();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: EnvironmentConfig.JWT_SECRET,
      signOptions: {
        expiresIn: '3600s',
      },
    }),
    PassportModule.register({ defaultStrategy: ['jwt'] }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
