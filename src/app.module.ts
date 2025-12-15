import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryModule } from './query/query.module';
import { MongoModule } from './mongodb/mongo.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    QueryModule,
    MongoModule,
    ConfigModule.forRoot(
      {isGlobal:true}
    )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
