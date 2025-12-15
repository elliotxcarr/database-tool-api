import { MongoClient } from 'mongodb';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const MongoProvider: Provider = {
  provide: 'MONGO_CONNECTION',
  inject:[ConfigService],
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('MONGO_URI') || 'mongodb://127.0.0.1:27017/'
    const client = new MongoClient(uri);
    await client.connect();
    return client.db('tres-local');
  },
};
