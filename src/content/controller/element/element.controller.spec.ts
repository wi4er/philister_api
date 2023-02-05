import { Test } from '@nestjs/testing';
import { ElementController } from './element.controller';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import * as request from 'supertest';
import { BlockEntity } from '../../model/block.entity';
import { ElementEntity } from '../../model/element.entity';
import { PropertyEntity } from '../../../property/model/property.entity';
import { Element2stringEntity } from '../../model/element2string.entity';
import { Element2flagEntity } from '../../model/element2flag.entity';
import { FlagEntity } from '../../../flag/model/flag.entity';
import { DirectoryEntity } from '../../../directory/model/directory.entity';
import { ValueEntity } from '../../../directory/model/value.entity';
import { Element2valueEntity } from '../../model/element2value.entity';

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
  afterAll(() => source.destroy());

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

  describe('Content element with strings', () => {
    test('Should get elements with properties', async () => {
      const block = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new ElementEntity, { block }).save();
      await Object.assign(new Element2stringEntity(), { parent, property, string: 'VALUE' }).save();

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
          await Object.assign(new Element2stringEntity(), { parent, property, string: 'VALUE' }).save();
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

    test('Should get elements with string filter', async () => {
      const block = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const blank = await Object.assign(new ElementEntity, { block }).save();
      const parent = await Object.assign(new ElementEntity, { block }).save();
      await Object.assign(new Element2stringEntity(), { parent, property, string: 'VALUE' }).save();

      const list = await request(app.getHttpServer())
        .get('/element?filter[string][eq]=VALUE')
        .expect(200);

      console.dir(list.body, { depth: 6 });

      expect(list.body).toHaveLength(1);
      expect(list.body[0].id).toBe(2);
      expect(list.body[0].property).toHaveLength(1);
      expect(list.body[0].property[0].string).toBe('VALUE');
      expect(list.body[0].property[0].property).toBe('NAME');
    });
  });

  describe('Content element with flags', () => {
    test('Should get element with flag', async () => {
      const block = await new BlockEntity().save();
      const parent = await Object.assign(new ElementEntity, { block }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new Element2flagEntity(), { parent, flag, string: 'VALUE' }).save();

      const list = await request(app.getHttpServer())
        .get('/element')
        .expect(200);

      expect(list.body).toHaveLength(1);
      expect(list.body[0].flag).toEqual([ 'ACTIVE' ]);
    });

    test('Should get element with flag filter', async () => {
      const block = await new BlockEntity().save();
      const parent = await Object.assign(new ElementEntity, { block }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new Element2flagEntity(), { parent, flag, string: 'VALUE' }).save();

      const blank = await Object.assign(new ElementEntity, { block }).save();

      const list = await request(app.getHttpServer())
        .get('/element?filter[flag][eq]=ACTIVE')
        .expect(200);

      expect(list.body).toHaveLength(1);
      expect(list.body[0]['flag']).toEqual([ 'ACTIVE' ]);
    });
  });

  describe('Content element with values', () => {
    test('Should get element with value', async () => {
      const block = await new BlockEntity().save();
      const parent = await Object.assign(new ElementEntity(), { block }).save();
      const property = await Object.assign(new PropertyEntity(), { id: 'CURRENT' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      const value = await Object.assign(new ValueEntity(), { id: 'LONDON', directory }).save();

      const inst = await Object.assign(new Element2valueEntity(), { parent, property, value }).save();

      const list = await request(app.getHttpServer())
        .get('/element')
        .expect(200);

      expect(list.body).toHaveLength(1);
      expect(list.body[0].property).toHaveLength(1);
      expect(list.body[0].property[0].value).toBe('LONDON');
      expect(list.body[0].property[0].directory).toBe('CITY');
    });

    test('Should get element with value filter', async () => {
      const block = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'CURRENT' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      const value = await Object.assign(new ValueEntity(), { id: 'LONDON', directory }).save();

      for (let i = 0; i < 10; i++) {
        const parent = await Object.assign(new ElementEntity(), { block }).save();

        if (i % 2) {
          await Object.assign(new Element2valueEntity(), { parent, property, value }).save();
        }
      }

      const list = await request(app.getHttpServer())
        .get('/element?filter[value][CITY][eq]=LONDON')
        .expect(200);

      expect(list.body).toHaveLength(5);
      expect(list.body[0].property).toHaveLength(1);
      expect(list.body[0].property[0].value).toBe('LONDON');
      expect(list.body[0].property[0].directory).toBe('CITY');
    });

    test('Should get element with value order', async () => {
      const block = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'CURRENT' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      const value = await Object.assign(new ValueEntity(), { id: 'LONDON', directory }).save();

      for (let i = 0; i < 10; i++) {
        const parent = await Object.assign(new ElementEntity(), { block }).save();

        if (i % 2) {
          await Object.assign(new Element2valueEntity(), { parent, property, value }).save();
        }
      }

      const list = await request(app.getHttpServer())
        .get('/element?sort[value][CITY]=asc')
        .expect(200);

      // expect(list.body).toHaveLength(5);
      // expect(list.body[0].property).toHaveLength(1);
      // expect(list.body[0].property[0].value).toBe('LONDON');
      // expect(list.body[0].property[0].directory).toBe('CITY');
    });
  });
});
