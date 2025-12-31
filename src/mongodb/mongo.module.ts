import { Module, Global } from '@nestjs/common';
import { MongoProviders } from './mongo.provider';

@Global()
@Module({
  providers: [...MongoProviders],
  exports: [...MongoProviders],
})
export class MongoModule {}
