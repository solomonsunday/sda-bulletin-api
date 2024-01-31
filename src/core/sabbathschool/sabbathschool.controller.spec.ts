import { Test, TestingModule } from '@nestjs/testing';
import { SabbathschoolController } from './sabbathschool.controller';
import { SabbathschoolService } from './sabbathschool.service';

describe('SabbathschoolController', () => {
  let controller: SabbathschoolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SabbathschoolController],
      providers: [SabbathschoolService],
    }).compile();

    controller = module.get<SabbathschoolController>(SabbathschoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
