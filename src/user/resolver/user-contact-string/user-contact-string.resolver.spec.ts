import { Test, TestingModule } from '@nestjs/testing';
import { UserContactStringResolver } from './user-contact-string.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserEntity } from "../../model/user.entity";
import { User2stringEntity } from "../../model/user2string.entity";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { UserContactEntity, UserContactType } from "../../model/user-contact.entity";
import { UserContact2stringEntity } from "../../model/user-contact2string.entity";


const contactItemQuery = gql`
  query GetUser($id: String!){
    userContact {
      item(id: $id) {
        id
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

describe('UserContactStringResolver', () => {
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
      const parent = await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();
      await Object.assign(new UserContact2stringEntity(), { string: 'VALUE', property, parent }).save()

      const res = await request(app.getHttpServer())
        .query(contactItemQuery, { id: 'mail' })
        .expectNoErrors();

      expect(res.data['userContact']['item']['propertyList']).toHaveLength(1);
      expect(res.data['userContact']['item']['propertyList'][0]['string']).toBe('VALUE');
    });
  });
});
