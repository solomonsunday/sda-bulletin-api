import { Controller } from '@nestjs/common';
import { AwsRepositoryService } from './aws-repository.service';

@Controller('aws-repository')
export class AwsRepositoryController {
  constructor(private readonly awsRepositoryService: AwsRepositoryService) {}
}
