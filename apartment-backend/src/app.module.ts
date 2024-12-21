import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { DataloaderModule } from './libs/dataloader/dataloader.module';
import { DataloaderService } from './libs/dataloader/dataloader.service';
import { HttpExceptionFilter } from './libs/exception-filter/global-exception';
import { GqlResponseInterceptor } from './libs/gql/graphql-response.interceptor';
import { DataLoaderInterceptor } from './libs/interceptors/data-loader.interceptor';
import { DynamicModules } from './modules/modules';
config();

@Module({
  imports: [
    DynamicModules.register(),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      inject: [DataloaderService],
      useFactory: (dataloaderService: DataloaderService) => ({
        playground: true,
        introspection: true,
        autoSchemaFile: join(process.cwd(), 'schema.gql'),
        cache: 'bounded',
        persistedQueries: false,
        context: ({ req, res }) => ({
          req,
          res,
          loader: dataloaderService.createLoaders(),
        }),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5454,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GqlResponseInterceptor(),
      inject: [],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class AppModule {}
