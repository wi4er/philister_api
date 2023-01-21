import { Test } from '@nestjs/testing';
import { MyselfController } from './myself.controller';
import { UserEntity } from '../../model/user.entity';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';

describe('MyselfController', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init();

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Myself endpoint', () => {
    test('Should get myself', async () => {
      await Object.assign(new UserEntity(), {
        login: 'user',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
      }).save();

      const { headers } = await request(app.getHttpServer())
        .get(`/auth`)
        .set('login', 'user')
        .set('password', 'qwerty');

      const res = await request(app.getHttpServer())
        .get(`/myself`)
        .set('cookie', headers['set-cookie']);

      expect(res.body.id).toBe(1);
      expect(res.body.login).toBe('user');
    });

    test('Shouldn`t get without authorization', async () => {
      const res = await request(app.getHttpServer())
        .get(`/myself`);

      expect(res.status).toBe(401);
    });

    test('Should update myself', async () => {
      await Object.assign(new UserEntity(), {
        login: 'user',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
      }).save();

      const { headers } = await request(app.getHttpServer())
        .get(`/auth`)
        .set('login', 'user')
        .set('password', 'qwerty');

      const res = await request(app.getHttpServer())
        .put(`/myself`)
        .send({
          login: 'admin',
          hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
          group: [],
          contact: [],
          property: [],
        })
        .set('cookie', headers['set-cookie']);

      expect(res.status).toBe(201);
      expect(res.body.login).toBe('admin');
      expect(res.body.id).toBe(1);
    });
  });

  describe('User registration', () => {
    test('Should register', async () => {
      const res = await request(app.getHttpServer())
        .post('/myself')
        .set('login', 'USER')
        .set('password', 'qwerty');

      expect(res.body['login']).toBe('USER');
      expect(res.body['id']).toBe(1);
    });

    test('Shouldn`t create with same login', async () => {
      await request(app.getHttpServer())
        .post('/myself')
        .set('login', 'USER')
        .set('password', 'qwerty');

      const res = await request(app.getHttpServer())
        .post('/myself')
        .set('login', 'USER')
        .set('password', 'qwerty');

      expect(res.status).toBe(400);
    });

    test('Shouldn`t create without login', async () => {
      const res = await request(app.getHttpServer())
        .post('/myself')
        .set('password', 'qwerty');

      expect(res.status).toBe(400);
    });

    test('Shouldn`t create without password', async () => {
      const res = await request(app.getHttpServer())
        .post('/myself')
        .set('login', 'USER');

      expect(res.status).toBe(400);
    });
  });
});
