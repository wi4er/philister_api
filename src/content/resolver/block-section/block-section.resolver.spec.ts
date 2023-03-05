import { Test } from '@nestjs/testing';
import { BlockSectionResolver } from './block-section.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { BlockEntity } from '../../model/block.entity';
import request from 'supertest-graphql';
import { SectionEntity } from '../../model/section.entity';
import { gql } from 'apollo-server-express';

const blockSectionQuery = gql`
  query getBlockElement($id: Int!) {
    block {
      item(id: $id) {
        id
        section {
          count
          list {
            id
          }
        }
      }
    }
  }
`;

describe('BlockSectionResolver', () => {
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

  describe('Block section count', () => {
    test('Should get block with element count', async () => {
      const block = await new BlockEntity().save();
      await Object.assign(new SectionEntity(), { block }).save();

      const res = await request(app.getHttpServer())
        .query(blockSectionQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['block']['item']['section']['count']).toBe(1);
    });
  });

  describe('Block section list', () => {
    test('Should get block with section list', async () => {
      const block = await new BlockEntity().save();
      await Object.assign(new SectionEntity(), { block }).save();

      const res = await request(app.getHttpServer())
        .query(blockSectionQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['block']['item']['section']['list']).toHaveLength(1);
      expect(res.data['block']['item']['section']['list'][0]['id']).toBe(1);
    });

    test('Should get with many blocks', async () => {
      await new BlockEntity().save();
      const block = await new BlockEntity().save();
      await Object.assign(new SectionEntity(), { block }).save();

      const res1 = await request(app.getHttpServer())
        .query(blockSectionQuery, { id: 1 })
        .expectNoErrors();
      expect(res1.data['block']['item']['section']['list']).toHaveLength(0);

      const res2 = await request(app.getHttpServer())
        .query(blockSectionQuery, { id: 2 })
        .expectNoErrors();
      expect(res2.data['block']['item']['section']['list']).toHaveLength(1);
    });
  });
});
