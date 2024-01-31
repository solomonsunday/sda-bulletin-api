import { Test, TestingModule } from '@nestjs/testing';
import { SabathSchoolService } from './sabath-school.service';

describe('SabathSchoolService', () => {
  let service: SabathSchoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SabathSchoolService],
    }).compile();

    service = module.get<SabathSchoolService>(SabathSchoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
