import { Test } from '@nestjs/testing';
import { UserContactMutationResolver } from './user-contact-mutation.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";

const addUserContact = gql`
  mutation AddUserContact($item: UserContactInput!) {
    userContact {
      add(item: $item) {
        id
      }
    }
  }
`;

describe('UserContactMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('UserContact addition', () => {
    test('Should add user contact', async () => {
      const res = await request(app.getHttpServer())
        .mutate(addUserContact, {
          item: {
            id: 'mail',
            type: 'EMAIL',
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['add']['id']).toBe('mail');
    });
  });
});
