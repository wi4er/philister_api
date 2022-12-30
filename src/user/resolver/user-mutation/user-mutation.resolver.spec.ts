import { Test } from '@nestjs/testing';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";
import { log } from "util";
import { UserEntity } from "../../model/user.entity";

const userAddMutation = gql`
  mutation AddUser($item: UserInput!) {
    user {
      add(item: $item) {
        id
        login
        contact {
          id
          value
          contact {
            id
          }
        }
      }
    }
  }
`;

const userUpdateMutation = gql`
  mutation UpdateUser($item: UserInput!) {
    user {
      update(item: $item) {
        id
        login
        contact {
          id
          value
          contact {
            id
          }
        }
      }
    }
  }
`;

describe('UserRootMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User addition', () => {
    it('Should add user', async () => {
      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            login: 'admin',
            contact: [],
            property: [],
          }
        });

      expect(res.data['user']['add']['id']).toBe(1);
      expect(res.data['user']['add']['login']).toBe('admin');
    });
  });

  describe('User addition', () => {
    test('Should update user', async () => {
      const user = await Object.assign(new UserEntity(), { login: 'NAME'}).save();
      const res = await request(app.getHttpServer())
        .mutate(userUpdateMutation, {
          item: {
            id: user.id,
            login: 'admin',
            contact: [],
            property: [],
          }
        });

      expect(res.data['user']['update']['login']).toBe('admin');
    });
  });
});
