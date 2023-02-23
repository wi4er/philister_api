import { Test } from '@nestjs/testing';
import { DirectoryController } from './directory.controller';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import * as request from "supertest";
import { DirectoryEntity } from "../../model/directory.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { Directory2stringEntity } from "../../model/directory2string.entity";
import { LangEntity } from "../../../lang/model/lang.entity";

describe('DirectoryController', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Directory get list', () => {
    test('Should get empty list', async () => {
      const res = await request(app.getHttpServer())
        .get('/directory');

      expect(res.body).toHaveLength(0);
    });

    test('Should get directory list', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .get('/directory');

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe('NAME');
    });

    test('Should get with string props', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(
        new Directory2stringEntity(),
        { parent: 'CITY', property: 'NAME', lang: 'EN', string: 'VALUE' }
      ).save();

      const res = await request(app.getHttpServer())
        .get('/directory');

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe('CITY');
    });
  });

  describe('Directory post', () => {
    test('Should add item', async () => {
      const res = await request(app.getHttpServer())
        .post('/directory')
        .send({
          id: 'LIST'
        });

      expect(res.body['id']).toBe('LIST');
    });
  });

  describe('Directory put', () => {
    test('Should update item', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .put('/directory')
        .send({ id: 'CITY' });
    });
  });
});
