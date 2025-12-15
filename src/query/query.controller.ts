import { Controller, Post, Body, Inject } from '@nestjs/common';
import { QueryBuilderService } from './query-builder.service';
import { FilterGroupDto } from './filter.dto';
import { Db } from 'mongodb';

@Controller('query')
export class QueryController {
  constructor(
    private readonly queryBuilder: QueryBuilderService,
    @Inject('MONGO_CONNECTION') private db: Db,
  ) {}

  @Post('run')
  async runQuery(@Body() filterGroup: FilterGroupDto) {
    
    const mongoQuery = this.queryBuilder.buildMongoQuery(filterGroup);
    const results = await this.db.collection(filterGroup.db).find(mongoQuery).toArray();
    return results;
  }
}
