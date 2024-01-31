import { Test, TestingModule } from '@nestjs/testing';
import { DivineServiceController } from './divine-service.controller';
import { DivineServiceService } from './divine-service.service';

describe('DivineServiceController', () => {
  let controller: DivineServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DivineServiceController],
      providers: [DivineServiceService],
    }).compile();

    controller = module.get<DivineServiceController>(DivineServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
