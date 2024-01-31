import { Module } from '@nestjs/common';
import { AwsRepositoryService } from './aws-repository.service';
import { AwsRepositoryController } from './aws-repository.controller';

@Module({
  controllers: [AwsRepositoryController],
  providers: [AwsRepositoryService],
})
export class AwsRepositoryModule {}
