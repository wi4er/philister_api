import { Test } from '@nestjs/testing';
import { ElementController } from './element.controller';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import * as request from 'supertest';
import { BlockEntity } from '../../model/block.entity';
import { ElementEntity } from '../../model/element.entity';
import { PropertyEntity } from '../../../property/model/property.entity';
import { ElementStringEntity } from '../../model/element-string.entity';

describe('ElementController', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init();

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Content element getting', () => {
    test('Should get empty element list', async () => {
      const list = await request(app.getHttpServer())
        .get('/element')
        .expect(200);

      expect(list.body).toEqual([]);
    });

    test('Should get element list', async () => {
      await new BlockEntity().save();
      await Object.assign(new ElementEntity, { block: 1 }).save();

      const list = await request(app.getHttpServer())
        .get('/element')
        .expect(200);

      expect(list.body).toHaveLength(1);
      expect(list.body[0].id).toBe(1);
    });
  });

  describe('Content element getting', () => {
    test('Should get elements with properties', async () => {
      const block = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new ElementEntity, { block }).save();
      await Object.assign(new ElementStringEntity(), { parent, property, string: 'VALUE' }).save();

      const list = await request(app.getHttpServer())
        .get('/element')
        .expect(200);

      expect(list.body).toHaveLength(1);
      expect(list.body[0].id).toBe(1);
      expect(list.body[0].property).toHaveLength(1);
      expect(list.body[0].property[0].string).toBe('VALUE');
      expect(list.body[0].property[0].property).toBe('NAME');
    });

    test('Should get elements list with many properties', async () => {
      const block = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      for (let i = 0; i < 10; i++) {
        const parent = await Object.assign(new ElementEntity, { block }).save();
        for (let j = 0; j < 10; j++) {
          await Object.assign(new ElementStringEntity(), { parent, property, string: 'VALUE' }).save();
        }
      }

      const list = await request(app.getHttpServer())
        .get('/element')
        .expect(200);

      expect(list.body).toHaveLength(10);
      expect(list.body[0].id).toBe(1);
      expect(list.body[0].property).toHaveLength(10);
      expect(list.body[0].property[0].string).toBe('VALUE');
      expect(list.body[0].property[0].property).toBe('NAME');
    });
  });
});
