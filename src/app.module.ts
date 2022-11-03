import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from 'node:path';
import { UserModule } from './user/user.module';
import { ElementModule } from './element/element.module';
import { FileModule } from './file/file.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user/model/user/user.entity";
import { PropertyModule } from './property/property.module';
import { PropertyEntity } from "./property/model/property.entity";
import { UserPropertyEntity } from "./user/model/user-property.entity";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'example',
      database: 'postgres',
      entities: [ UserEntity, PropertyEntity, UserPropertyEntity ],
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
