import { Test } from '@nestjs/testing';
import { UserDescriptionResolver } from './user-description.resolver';
import { gql } from "apollo-server-express";
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserEntity } from "../../model/user.entity";
import request from "supertest-graphql";
import { User2descriptionEntity } from "../../model/user2description.entity";

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

          ... on UserDescription {
            description
            lang {
              id
            }
          }
        }
      }
    }
  }
`;

describe('UserDescriptionResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User description property', () => {
    test('Should get user with property', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'name' }).save();
      const parent = await Object.assign(new UserEntity(), { login: 'user' }).save();
      await Object.assign(new User2descriptionEntity(), { description: "VALUE", property, parent }).save()

      const res = await request(app.getHttpServer())
        .query(userItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['user']['item']['propertyList']).toHaveLength(1);
      expect(res.data['user']['item']['propertyList'][0]['property']['id']).toBe('name');
      expect(res.data['user']['item']['propertyList'][0]['description']).toBe('VALUE');
      expect(res.data['user']['item']['propertyList'][0]['string']).toBe('VALUE');
    });
  });
});
