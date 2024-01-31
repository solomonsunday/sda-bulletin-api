import { Module } from '@nestjs/common';
import { SabathSchoolService } from './sabath-school.service';
import { SabathSchoolController } from './sabath-school.controller';

@Module({
  controllers: [SabathSchoolController],
  providers: [SabathSchoolService],
})
export class SabathSchoolModule {}
