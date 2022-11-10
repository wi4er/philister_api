import { AuthMutationResolver } from './auth-mutation.resolver';
import { createConnection } from "typeorm";
import { UserEntity } from "../../model/user.entity";
import request from 'supertest-graphql';
import { AppModule } from "../../../app.module";
import { gql } from "apollo-server-express";
import { Test } from "@nestjs/testing";
import { createConnectionOptions } from "../../../createConnectionOptions";

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
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
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
