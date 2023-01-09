import { Test } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserEntity } from "../../model/user.entity";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";
import { createConnectionOptions } from "../../../createConnectionOptions";

const userItemQuery = gql`
  query GetUser($id: Int!){
    user {
      item(id: $id) {
        id
        login
        propertyList {
          id
          string
          property {
            id
          }
        }
      }
    }
  }
`;

describe('UserResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User fields', () => {
    test('Should get user list', async () => {
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();

      const res = await request(app.getHttpServer())
        .query(userItemQuery, { id: user.id })
        .expectNoErrors();

      expect(res.data['user']['item']['id']).toBe(1);
      expect(res.data['user']['item']['login']).toBe('user');
    });
  });

  describe('User property', () => {
    test('Should get different properties', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'name' }).save();
      const user = await Object.assign(new UserEntity(), { login: 'USER' }).save();

      // const user = await Object.assign(new UserEntity(),{
      //   login: 'user',
      //   property: [
      //     await Object.assign(new User2stringEntity(), {value: "VALUE", property}).save()
      //   ],
      //
      // }).save();

      // const res = await request(app.getHttpServer())
      //   .query(userItemQuery, {id: user.id})
      //   .expectNoErrors();
    });
  });
});
