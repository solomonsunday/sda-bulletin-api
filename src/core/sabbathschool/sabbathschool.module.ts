import { Module } from '@nestjs/common';
import { SabbathschoolService } from './sabbathschool.service';
import { SabbathschoolController } from './sabbathschool.controller';

@Module({
  controllers: [SabbathschoolController],
  providers: [SabbathschoolService],
})
export class SabbathschoolModule {}
