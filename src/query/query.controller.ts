import { Controller, Post, Body } from '@nestjs/common';
import { QueryBuilderService } from './query-builder.service';
import { FilterGroupDto } from './filter.dto';

@Controller('query')
export class QueryController {
  constructor(private readonly queryBuilder: QueryBuilderService) {}

  @Post('run')
  async runQuery(@Body() filterGroup: FilterGroupDto) {
    const mongoQuery = this.queryBuilder.buildMongoQuery(filterGroup);
    // Example: call MongoDB using the native driver
    const results = await this.getCollection('users')
      .find(mongoQuery)
      .toArray();

    return results;
  }

  private getCollection(name: string) {
    // Assume you have injected or created a MongoDB client somewhere
    return global.mongo.db('mydb').collection(name);
  }
}
