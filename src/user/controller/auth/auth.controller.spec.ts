import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { UserEntity } from '../../model/user.entity';
import * as request from 'supertest';
import { DataSource } from 'typeorm/data-source/DataSource';

describe('AuthController', () => {
  let source: DataSource;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init();

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('User auth', () => {
    test('Should auth', async () => {
      await Object.assign(new UserEntity(), {
        login: 'USER',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
      }).save();

      const res = await request(app.getHttpServer())
        .get('/auth')
        .set('login', 'USER')
        .set('password', 'qwerty');

      expect(res.body['login']).toBe('USER');
      expect(res.body['id']).toBe(1);
    });

    test('Shouldn`t auth', async () => {
      await Object.assign(new UserEntity(), {
        login: 'USER',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
      }).save();

      const res = await request(app.getHttpServer())
        .get('/auth')
        .set('login', 'USER')
        .set('password', 'wrong');

      expect(res.status).toBe(401);
    });
  });

  describe('Session closing', () => {
    test('Should close session', async () => {
      await Object.assign(new UserEntity(), {
        login: 'USER',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
      }).save();

      const user = await request(app.getHttpServer())
        .get('/auth')
        .set('login', 'USER')
        .set('password', 'qwerty');

      const cookie = user.headers['set-cookie'];

      const res = await request(app.getHttpServer())
        .delete('/auth')
        .set('cookie', cookie);

      expect(res.body).toBe(true);
      expect(res.status).toBe(200);
    });

    test('Shouldn`t close without session', async () => {
      const res = await request(app.getHttpServer())
        .delete('/auth');

      expect(res.body).toBe(false);
      expect(res.status).toBe(400);
    });
  });
});
