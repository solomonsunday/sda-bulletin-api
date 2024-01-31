import { Module } from '@nestjs/common';
import { DivineServiceService } from './divine-service.service';
import { DivineServiceController } from './divine-service.controller';

@Module({
  controllers: [DivineServiceController],
  providers: [DivineServiceService],
})
export class DivineServiceModule {}
