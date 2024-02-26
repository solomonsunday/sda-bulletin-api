import { Module } from '@nestjs/common';
import { BulletinService } from './bulletin.service';
import { BulletinController } from './bulletin.controller';
import { CachingModule } from 'src/common/caching/caching.module';

@Module({
  imports: [CachingModule],
  controllers: [BulletinController],
  providers: [BulletinService],
})
export class BulletinModule {}
