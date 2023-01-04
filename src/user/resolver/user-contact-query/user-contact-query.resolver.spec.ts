import { Test } from '@nestjs/testing';
import { UserContactQueryResolver } from './user-contact-query.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";
import { UserContactEntity, UserContactType } from "../../model/user-contact.entity";

const contactListQuery = gql`
  query GetContactList {
    userContact {
      list {
        id
        type
      }
    }
  }
`;

describe('UserContactQueryResolver', () => {
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
      const res = await request(app.getHttpServer())
        .query(contactListQuery)
        .expectNoErrors();

      expect(res.data['userContact']['list']).toHaveLength(0);
    });

    test('Should get list', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new UserContactEntity(), { id: `CONTACT_${i}`, type: UserContactType.EMAIL }).save();
      }

      const res = await request(app.getHttpServer())
        .query(contactListQuery)
        .expectNoErrors();

      expect(res.data['userContact']['list']).toHaveLength(10);
      expect(res.data['userContact']['list'][0]['type']).toBe('EMAIL');
    });
  });
});
