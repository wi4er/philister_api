import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from 'node:path';
import { UserModule } from './user/user.module';
import { ElementModule } from './element/element.module';
import { FileModule } from './file/file.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user/model/user.entity";
import { PropertyModule } from './property/property.module';
import { PropertyEntity } from "./property/model/property.entity";
import { UserPropertyEntity } from "./user/model/user-property.entity";
import { GraphQLRequestContext, GraphQLResponse } from "apollo-server-types";
import { PropertyPropertyEntity } from "./property/model/property-property.entity";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatResponse: (response: GraphQLResponse, requestContext: GraphQLRequestContext) => {
        const headers = requestContext.response.http;
        headers.headers.set('access-control-allow-origin', requestContext.request.http.headers.get('origin'));
        return response;
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'example',
      database: 'postgres',
      entities: [ UserEntity, PropertyEntity, PropertyPropertyEntity, UserPropertyEntity ],
      synchronize: true,
    }),
    UserModule,
    ElementModule,
    FileModule,
    PropertyModule,
  ],
  controllers: [ AppController ],
  providers: [],
})
export class AppModule {
}
