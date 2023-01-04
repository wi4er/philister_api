import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { UserEntity } from "../../model/user.entity";
import * as request from "supertest";

describe('AuthController', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

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

  describe('User registration', () => {
    test('Should register', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth')
        .set('login', 'USER')
        .set('password', 'qwerty');

      expect(res.body['login']).toBe('USER');
      expect(res.body['id']).toBe(1);
    });

    test('Shouldn`t create with same id', async () => {
      await request(app.getHttpServer())
        .post('/auth')
        .set('login', 'USER')
        .set('password', 'qwerty');

      const res = await request(app.getHttpServer())
        .post('/auth')
        .set('login', 'USER')
        .set('password', 'qwerty');

      expect(res.status).toBe(400);
    });

    test('Shouldn`t create without login', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth')
        .set('password', 'qwerty');

      expect(res.status).toBe(400);
    });

    test('Shouldn`t create without password', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth')
        .set('login', 'USER')

      expect(res.status).toBe(400);
    });
  });
});
