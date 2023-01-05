import { Test } from '@nestjs/testing';
import { UserContactMutationResolver } from './user-contact-mutation.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { UserContactEntity, UserContactType } from "../../model/user-contact.entity";

const addUserContact = gql`
  mutation AddUserContact($item: UserContactInput!) {
    userContact {
      add(item: $item) {
        id
      }
    }
  }
`;

const updateUserContact = gql`
  mutation AddUserContact($item: UserContactInput!) {
    userContact {
      update(item: $item) {
        id
        type
      }
    }
  }
`;

const deleteUserContact = gql`
  mutation DeleteUserContact($id: [String!]!) {
    userContact {
      delete(id: $id)
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

  describe('UserContact update', () => {
    test('Should update contact', async () => {
      await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateUserContact, {
          item: {
            id: 'mail',
            type: 'PHONE',
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['update']['id']).toBe('mail');
      expect(res.data['userContact']['update']['type']).toBe('PHONE');
    });
  });

  describe('UserContact deletion', () => {
    test('Should delete contact', async () => {
      await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();
      const res = await request(app.getHttpServer())
        .mutate(deleteUserContact, { id: 'mail' })
        .expectNoErrors();

      expect(res.data['userContact']['delete']).toEqual([ 'mail' ]);
    });
  });
});
