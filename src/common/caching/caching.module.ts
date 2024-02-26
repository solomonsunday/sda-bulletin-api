import { Global, Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
