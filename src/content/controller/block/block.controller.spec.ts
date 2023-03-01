import { Test } from '@nestjs/testing';
import { BlockController } from './block.controller';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import * as request from 'supertest';
import { BlockEntity } from '../../model/block.entity';

describe('BlockController', () => {
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

  describe('Content block getting', () => {
    test('Should get empty block list', async () => {
      const list = await request(app.getHttpServer())
        .get('/block')
        .expect(200)

      expect(list.body).toEqual([]);
    });

    test('Should get block list', async () => {
      await new BlockEntity().save();

      const list = await request(app.getHttpServer())
        .get('/block')
        .expect(200)

      expect(list.body).toHaveLength(1);
      expect(list.body[0].id).toBe(1);
    });
  });


});
