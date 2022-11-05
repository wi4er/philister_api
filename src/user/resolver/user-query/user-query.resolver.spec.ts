import { Test } from '@nestjs/testing';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../../app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import redisPermission from "../../../permission/redis.permission";
import { createConnection } from "typeorm";
import { UserEntity } from "../../model/user/user.entity";
import { UserPropertyEntity } from "../../model/user-property.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";

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
    await NestFactory.create(AppModule, new ExpressAdapter());

    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.use(redisPermission());
    app.init()

    source = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'example',
      database: 'postgres',
      synchronize: true,
      // logging: true,
      entities: [ UserEntity, UserPropertyEntity, PropertyEntity ],
      subscribers: [],
      migrations: [],
    });
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
      for (let i = 0; i <= 10; i++) {
        await Object.assign(new UserEntity(), {login: `myself_${i}`}).save();
      }

      const res = await request(app.getHttpServer())
        .query(userListQuery)
        .expectNoErrors();

      expect(res.data['user']['list']).toHaveLength(11);
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

      const myself = await request(app.getHttpServer())
        .set("cookie", session)
        .query(myselfQuery, {})
        .expectNoErrors();

      expect(myself.data['user']['myself']['login']).toBe('myself');
    });
  });
});
