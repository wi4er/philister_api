import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { UserEntity } from "../../model/user.entity";
import * as request from 'supertest';

describe('UserController', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User fields', () => {
    test('Should get user list', async () => {
      await Object.assign(new UserEntity(), { login: 'USER' }).save();

      const res = await request(app.getHttpServer())
        .get('/user');

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(1);
      expect(res.body[0].login).toBe('USER');
    });

    test('Should get user item', async () => {
      await Object.assign(new UserEntity(), { login: 'USER' }).save();

      const res = await request(app.getHttpServer())
        .get(`/user/1`);

      expect(res.body.id).toBe(1);
      expect(res.body.login).toBe('USER');
    });
  });

  describe('Myself endpoint', () => {
    test('Should get myself', async () => {
      await Object.assign(new UserEntity(), {
        login: 'user',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5'
      }).save();

      const { headers } = await request(app.getHttpServer())
        .get(`/auth`)
        .set('login', 'user')
        .set('password', 'qwerty');

      const res = await request(app.getHttpServer())
        .get(`/user/myself`)
        .set('cookie', headers['set-cookie']);

      expect(res.body.id).toBe(1);
      expect(res.body.login).toBe('user');
    });

    test('Shouldn`t get without authorization', async () => {
      const res = await request(app.getHttpServer())
        .get(`/user/myself`);

      expect(res.status).toBe(401);
    });
  });
});