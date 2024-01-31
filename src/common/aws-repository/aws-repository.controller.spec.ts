import { Test, TestingModule } from '@nestjs/testing';
import { AwsRepositoryController } from './aws-repository.controller';
import { AwsRepositoryService } from './aws-repository.service';

describe('AwsRepositoryController', () => {
  let controller: AwsRepositoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwsRepositoryController],
      providers: [AwsRepositoryService],
    }).compile();

    controller = module.get<AwsRepositoryController>(AwsRepositoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
