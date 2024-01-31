import { Test, TestingModule } from '@nestjs/testing';
import { AwsRepositoryService } from './aws-repository.service';

describe('AwsRepositoryService', () => {
  let service: AwsRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsRepositoryService],
    }).compile();

    service = module.get<AwsRepositoryService>(AwsRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
