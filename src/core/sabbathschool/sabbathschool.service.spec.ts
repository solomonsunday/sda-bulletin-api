import { Test, TestingModule } from '@nestjs/testing';
import { SabbathschoolService } from './sabbathschool.service';

describe('SabbathschoolService', () => {
  let service: SabbathschoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SabbathschoolService],
    }).compile();

    service = module.get<SabbathschoolService>(SabbathschoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
