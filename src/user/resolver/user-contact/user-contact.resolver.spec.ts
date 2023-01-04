import { Test, TestingModule } from '@nestjs/testing';
import { UserContactResolver } from './user-contact.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { UserContactEntity, UserContactType } from "../../model/user-contact.entity";


const userContactPropertyListQuery = gql`
  query getContactPropertyListItem($id: String!) {
    userContact {
      item(id: $id) {
        id
        type
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

describe('UserContactResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('UserContact list', () => {
    test('Should get empty list', async () => {
      await Object.assign(new UserContactEntity(), { id: 'EMAIL', type: UserContactType.EMAIL }).save();

      const res = await request(app.getHttpServer())
        .query(userContactPropertyListQuery, { id: 'EMAIL' })
        .expectNoErrors();

      // expect(res.data['userContact']['list']).toHaveLength(0);
    });
  });
});
