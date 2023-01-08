import { Test, TestingModule } from '@nestjs/testing';
import { UserStringResolver } from './user-string.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserEntity } from "../../model/user.entity";
import { User2stringEntity } from "../../model/user2string.entity";
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
      const parent = await Object.assign(new UserEntity(), { login: 'user' }).save();
      await Object.assign(new User2stringEntity(), { string: "VALUE", property, parent }).save()

      const res = await request(app.getHttpServer())
        .query(userItemQuery, { id: 1 })
        .expectNoErrors();

      // console.log(res)
      console.log(res.data['user']['item'])
    });
  });
});
