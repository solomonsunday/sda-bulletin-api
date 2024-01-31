import { Test, TestingModule } from '@nestjs/testing';
import { DivineServiceService } from './divine-service.service';

describe('DivineServiceService', () => {
  let service: DivineServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DivineServiceService],
    }).compile();

    service = module.get<DivineServiceService>(DivineServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
