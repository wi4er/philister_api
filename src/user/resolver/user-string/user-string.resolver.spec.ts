import { Test, TestingModule } from '@nestjs/testing';
import { UserStringResolver } from './user-string.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserEntity } from "../../model/user.entity";
import { UserStringEntity } from "../../model/user-string.entity";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";

const userItemQuery = gql`
  query GetUser($id: Int!){
    user {
      item(id: $id) {
        id
        login
        property {
          id
          string
        }
      }
    }
  }
`;

describe('UserPropertyResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User string property', () => {
    test('Should get user with property', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'name' }).save();
      const user = await Object.assign(new UserEntity(), {
        login: 'user',
        property: [
          await Object.assign(new UserStringEntity(), { string: "VALUE", property }).save()
        ]
      }).save();

      const res = await request(app.getHttpServer())
        .query(userItemQuery, { id: user.id })
        .expectNoErrors();
    });
  });
});
