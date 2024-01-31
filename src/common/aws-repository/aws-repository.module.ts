import { Global, Module } from '@nestjs/common';
import { AwsRepositoryService } from './aws-repository.service';

@Global()
@Module({
  providers: [AwsRepositoryService],
  exports: [AwsRepositoryService],
})
export class AwsRepositoryModule {}
