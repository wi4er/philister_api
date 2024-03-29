import { Test } from '@nestjs/testing';
import { UserUserResolver } from './user-user.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { PropertyEntity } from "../../../property/model/property.entity";
import request from "supertest-graphql";
import { UserEntity } from "../../model/user.entity";
import { User2userEntity } from "../../model/user2user.entity";
import { gql } from "apollo-server-express";

const userItemQuery = gql`
  query getUserItem($id: Int!) {
    user {
      item(id: $id) {
        id
        propertyList {
          id
          string
          property {
            id
          }

          ... on UserUser {
            user {
              id
            }
          }
        }
      }
    }
  }
`

describe('UserUserResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User with user', () => {
    test('Should get with user property', async () => {
      const parent = await Object.assign(new UserEntity(), { login: 'parent' }).save();
      const user = await Object.assign(new UserEntity(), { login: 'child' }).save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new User2userEntity(), { parent, property, user }).save();

      const res = await request(app.getHttpServer())
        .query(userItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['user']['item']['propertyList']).toHaveLength(1);
      expect(res.data['user']['item']['propertyList'][0]['string']).toBe('2');
      expect(res.data['user']['item']['propertyList'][0]['user']['id']).toBe(2);
    });
  });
});
