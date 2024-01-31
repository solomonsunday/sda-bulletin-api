import { Test, TestingModule } from '@nestjs/testing';
import { SabathSchoolController } from './sabath-school.controller';
import { SabathSchoolService } from './sabath-school.service';

describe('SabathSchoolController', () => {
  let controller: SabathSchoolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SabathSchoolController],
      providers: [SabathSchoolService],
    }).compile();

    controller = module.get<SabathSchoolController>(SabathSchoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
