import { MongoClient } from 'mongodb';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const MongoProviders: Provider[] = [
  {
    provide: 'MONGO_LOCAL',
    inject:[ConfigService],
    useFactory: async (configService: ConfigService) => {
      const uri = configService.get<string>('LOCAL') || ''
      const client = new MongoClient(uri);
      await client.connect();
      return client.db('tres-local');
    },
  },
  {
    provide: 'MONGO_DEV',
    inject:[ConfigService],
    useFactory: async (configService: ConfigService) => {
      const uri = configService.get<string>('DEV') || ''
      const client = new MongoClient(uri);
      await client.connect();
      return client.db('tres-1');
    },
  }
];
