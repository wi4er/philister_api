import { Test } from '@nestjs/testing';
import { ElementController } from './element.controller';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import * as request from 'supertest';
import { BlockEntity } from '../../model/block.entity';
import { ElementEntity } from '../../model/element.entity';

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
});
