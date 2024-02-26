import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setDataToCache<TValue extends Record<string, any>>(
    key: string,
    value: TValue,
  ) {
    await this.cacheManager.set(key, { ...value });
  }

  async getCahedData<TResponse>(key: string) {
    return (await this.cacheManager.get(key)) as TResponse;
  }

  async deleteDataFromCache(key: string) {
    await this.cacheManager.del(key);
  }

  async resetDataFromCache(key: string) {
    await this.cacheManager.del(key);
  }
}
