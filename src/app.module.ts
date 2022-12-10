import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from 'node:path';
import { UserModule } from './user/user.module';
import { ContentModule } from './content/content.module';
import { FileModule } from './file/file.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PropertyModule } from './property/property.module';
import { GraphQLRequestContext, GraphQLResponse } from "apollo-server-types";
import { createConnectionOptions } from "./createConnectionOptions";
import { DirectoryModule } from './directory/directory.module';
import { FlagModule } from './flag/flag.module';
import { LangModule } from './lang/lang.module';
import { LogModule } from './log/log.module';
import { CommonModule } from './common/common.module';
import redisPermission from "./permission/redis.permission";
import * as cors from "cors";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatResponse: (response: GraphQLResponse, requestContext: GraphQLRequestContext) => {
        const { headers } = requestContext.response.http;
        headers.set('access-control-allow-origin', requestContext.request.http.headers.get('origin'));

        return response;
      },
    }),
    TypeOrmModule.forRoot(createConnectionOptions()),
    UserModule,
    ContentModule,
    FileModule,
    PropertyModule,
    DirectoryModule,
    FlagModule,
    LangModule,
    LogModule,
    CommonModule,
  ],
  controllers: [ AppController ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(redisPermission())
      .forRoutes('/');

    consumer
      .apply(cors({
        credentials: true,
        origin: true,
      }))
      .forRoutes('/');
  }
}
