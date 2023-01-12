import { Test } from '@nestjs/testing';
import { UserValueResolver } from './user-value.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { UserEntity } from "../../model/user.entity";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { DirectoryEntity } from "../../../directory/model/directory.entity";
import { ValueEntity } from "../../../directory/model/value.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { User2valueEntity } from "../../model/user2value.entity";

const userItemQuery = gql`
  query getUser($id: Int!) {
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
          ... on UserValue {
            value {
              id
            }
          }
          __typename
        }
      }
    }
  }
`;

describe('UserValueResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User with values', () => {
    test("Should get user with value", async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), { id: 'LONDON', directory: 'CITY' }).save();
      await Object.assign(new PropertyEntity(), { id: 'CURRENT_CITY' }).save();
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();

      await Object.assign(new User2valueEntity(), {
        property: 'CURRENT_CITY',
        value: 'LONDON',
        parent: 1,
      }).save();

      const res = await request(app.getHttpServer())
        .query(userItemQuery, { id: user.id })
        .expectNoErrors();

      expect(res.data['user']['item']['propertyList']).toHaveLength(1);
      expect(res.data['user']['item']['propertyList'][0]['string']).toBe('LONDON');
      expect(res.data['user']['item']['propertyList'][0]['property']['id']).toBe('CURRENT_CITY');
      expect(res.data['user']['item']['propertyList'][0]['value']['id']).toBe('LONDON');
    });
  });
});