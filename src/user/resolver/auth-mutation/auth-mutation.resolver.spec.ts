import { AuthMutationResolver } from './auth-mutation.resolver';
import { createConnection } from "typeorm";
import { UserEntity } from "../../model/user/user.entity";
import { UserPropertyEntity } from "../../model/user-property.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { NestFactory } from "@nestjs/core";
import request from 'supertest-graphql';
import { AppModule } from "../../../app.module";
import { gql } from "apollo-server-express";
import { ExpressAdapter } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import redisPermission from "../../../permission/redis.permission";

const query = gql`
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

describe('AuthMutationResolver', () => {
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

  test('Should auth', async () => {
    await Object.assign(
      new UserEntity(),
      {
        login: 'admin',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5'
      }
    ).save();

    const res = await request(app.getHttpServer())
      .query(query, {
        login: 'admin',
        password: 'qwerty',
      })
      .expectNoErrors();

    expect(res.data['auth']['authByPassword']['login']).toBe('admin');
  });

  test('Shouldn`t auth with wrong password', async () => {
    await Object.assign(
      new UserEntity(),
      {
        login: 'admin',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5'
      }
    ).save();

    const res = await request(app.getHttpServer())
      .query(query, {
        login: 'admin',
        password: 'wrong',
      })
      .expectNoErrors();

    expect(res.data['auth']['authByPassword']).toBe(null);
  });
});
