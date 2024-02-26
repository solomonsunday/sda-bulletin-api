import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ErrorModule, HttpExceptionFilter } from './common';
import { AuthModule } from './core';
import { SabathSchoolModule } from './core/sabath-school/sabath-school.module';
import { AwsRepositoryModule } from './common/aws-repository/aws-repository.module';
import { DivineServiceModule } from './core/divine-service/divine-service.module';
import { BulletinModule } from './core/bulletin/bulletin.module';
import { AnnouncementModule } from './core/announcement/announcement.module';
import { CachingModule } from './common/caching/caching.module';

@Module({
  imports: [
    AuthModule,
    ErrorModule,
    SabathSchoolModule,
    AwsRepositoryModule,
    SabathSchoolModule,
    DivineServiceModule,
    BulletinModule,
    AnnouncementModule,
    CachingModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    AppService,
  ],
})
export class AppModule {}
