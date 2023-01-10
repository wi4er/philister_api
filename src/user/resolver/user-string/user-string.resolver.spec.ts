import { Test } from '@nestjs/testing';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserEntity } from "../../model/user.entity";
import { User2stringEntity } from "../../model/user2string.entity";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";
import { LangEntity } from "../../../lang/model/lang.entity";

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
          
          ... on UserString {
            lang {
              id
            }
          }
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

      expect(res.data['user']['item']['propertyList']).toHaveLength(1);
      expect(res.data['user']['item']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['user']['item']['propertyList'][0]['property']['id']).toBe('name');
    });

    test('Should get user with lang property', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'name' }).save();
      const parent = await Object.assign(new UserEntity(), { login: 'user' }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(new User2stringEntity(), { string: "VALUE", property, parent, lang }).save();

      const res = await request(app.getHttpServer())
        .query(userItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['user']['item']['propertyList']).toHaveLength(1);
      expect(res.data['user']['item']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['user']['item']['propertyList'][0]['property']['id']).toBe('name');
      expect(res.data['user']['item']['propertyList'][0]['lang']['id']).toBe('EN');
    });
  });
});
