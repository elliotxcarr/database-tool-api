import { Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { QueryBuilderService } from './query-builder.service';

@Module({
  controllers: [QueryController],
  providers: [QueryBuilderService],
  exports: [QueryBuilderService]
})
export class QueryModule {}
