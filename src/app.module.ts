import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ErrorModule, HttpExceptionFilter } from './common';
import { AuthModule } from './core';
import { SabbathschoolModule } from './core/sabbathschool/sabbathschool.module';
import { AwsRepositoryModule } from './common/aws-repository/aws-repository.module';
import { AwsRepositoryModule } from './common/aws-repository/aws-repository.module';

@Module({
  imports: [AuthModule, ErrorModule, SabbathschoolModule, AwsRepositoryModule],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    AppService,
  ],
})
export class AppModule {}
