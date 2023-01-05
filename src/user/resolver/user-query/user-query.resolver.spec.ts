import { Test } from '@nestjs/testing';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { UserEntity } from "../../model/user.entity";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";
import { createConnectionOptions } from "../../../createConnectionOptions";

const userListQuery = gql`
  {
    user {
      list {
        id
        login
      }
    }
  }
`;

const userItemQuery = gql`
  query getUser($id: Int!) {
    user {
      item(id: $id) {
        id
        login
      }
    }
  }
`;

const myselfQuery = gql`
  {
    user {
      myself {
        id
        login
      }
    }
  }
`;

const authQuery = gql`
  mutation Auth($login: String!, $password: String!) {
    auth {
      authByPassword(login: $login, password: $password) {
        id
        login
        hash
      }
    }
  }
`;

describe('UserRootQueryResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User list', () => {
    test('Should get user list', async () => {
      await Object.assign(
        new UserEntity(),
        {
          login: 'myself',
          hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5'
        }
      ).save();

      const res = await request(app.getHttpServer())
        .query(userListQuery)
        .expectNoErrors();

      expect(res.data['user']['list']).toHaveLength(1);
    });

    test('Should get user list with many users', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new UserEntity(), { login: `myself_${i}` }).save();
      }

      await Object.assign(
        new UserEntity(),
        {
          login: 'admin',
          hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5'
        }
      ).save();

      const res = await request(app.getHttpServer())
        .query(userListQuery)
        .expectNoErrors();

      expect(res.data['user']['list']).toHaveLength(11);
    });
  });

  describe('User item', () => {
    test("Should get user item", async () => {
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();

      const res = await request(app.getHttpServer())
        .query(userItemQuery, { id: user.id })
        .expectNoErrors();

      expect(res.data['user']['item']['login']).toBe('user');
    });

    test("Shouldn't get item with wrong id", async () => {
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();

      const res = await request(app.getHttpServer())
        .query(userItemQuery, { id: user.id + 1 })
        .expectNoErrors();

      expect(res.data['user']['item']).toBe(null);
    });
  });

  describe('User myself', () => {
    it('Should get myself', async () => {
      await Object.assign(
        new UserEntity(),
        {
          login: 'myself',
          hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5'
        }
      ).save();

      const res = await request(app.getHttpServer())
        .query(authQuery, {
          login: 'myself',
          password: 'qwerty',
        })
        .expectNoErrors();

      const session = res.response.headers['set-cookie'];

      // const myself = await request(app.getHttpServer())
      //   .set("cookie", session)
      //   .query(myselfQuery, {})
      //   .expectNoErrors();
      //
      // expect(myself.data['user']['myself']['login']).toBe('myself');
    });
  });
});
