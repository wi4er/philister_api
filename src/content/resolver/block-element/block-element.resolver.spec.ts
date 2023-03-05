import { Test } from '@nestjs/testing';
import { BlockElementResolver } from './block-element.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { BlockEntity } from '../../model/block.entity';
import { ElementEntity } from '../../model/element.entity';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';

const blockElementsQuery = gql`
  query getBlockElement($id: Int!) {
    block {
      item(id: $id) {
        id
        element {
          count
          list {
            id
          }
        }
      }
    }
  }
`;

describe('BlockElementResolver', () => {
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

  describe('Block elements count', () => {
    test('Should get block with element count', async () => {
      const block = await new BlockEntity().save();
      await Object.assign(new ElementEntity(), { block }).save();

      const res = await request(app.getHttpServer())
        .query(blockElementsQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['block']['item']['element']['count']).toBe(1);
    });
  });

  describe('Block elements list', () => {
    test('Should get block with element list', async () => {
      const block = await new BlockEntity().save();
      await Object.assign(new ElementEntity(), { block }).save();

      const res = await request(app.getHttpServer())
        .query(blockElementsQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['block']['item']['element']['list']).toHaveLength(1);
      expect(res.data['block']['item']['element']['list'][0]['id']).toBe(1);
    });
  });
});
