import { Controller, Post, Body, Inject } from '@nestjs/common';
import { QueryBuilderService } from './query-builder.service';
import { FilterGroupDto } from './filter.dto';
import { Db } from 'mongodb';

@Controller('query')
export class QueryController {
  constructor(
    private readonly queryBuilder: QueryBuilderService,
    @Inject('MONGO_LOCAL') private localDb: Db,
    @Inject('MONGO_DEV') private devDb: Db,
  ) {}

  @Post('run')
  async runQuery(@Body() filterGroup: FilterGroupDto) {
    const db = filterGroup.env === 'LOCAL' ? this.localDb : this.devDb;
    const mongoQuery = this.queryBuilder.buildMongoQuery(filterGroup);
    const results = await db.collection(filterGroup.db).find(mongoQuery).toArray();
    console.log(mongoQuery)
    console.log(results)
    return results;
  }
}
