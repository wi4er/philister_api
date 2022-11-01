import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from 'node:path';
import { UserModule } from './user/user.module';
import { ElementModule } from './element/element.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UserModule,
    ElementModule,
  ],
  controllers: [ AppController ],
  providers: [],
})
export class AppModule {
}
