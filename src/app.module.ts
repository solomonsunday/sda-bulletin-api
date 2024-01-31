import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ErrorModule, HttpExceptionFilter } from './common';
import { AuthModule } from './core';
import { SabbathschoolModule } from './core/sabbathschool/sabbathschool.module';
import { AwsRepositoryModule } from './common/aws-repository/aws-repository.module';
import { SabathSchoolModule } from './core/sabath-school/sabath-school.module';
import { DivineServiceModule } from './core/divine-service/divine-service.module';
import { BulletinModule } from './core/bulletin/bulletin.module';

@Module({
  imports: [AuthModule, ErrorModule, SabbathschoolModule, AwsRepositoryModule, SabathSchoolModule, DivineServiceModule, BulletinModule],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    AppService,
  ],
})
export class AppModule {}
