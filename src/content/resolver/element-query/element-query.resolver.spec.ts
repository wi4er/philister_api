import { Test } from '@nestjs/testing';
import { ElementQueryResolver } from './element-query.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import request from 'supertest-graphql';
import { BlockEntity } from '../../model/block.entity';
import { ElementEntity } from '../../model/element.entity';
import { gql } from 'apollo-server-express';

const elementListQuery = gql`
  query GetElementList($limit: Int, $offset: Int, $filter: [ElementFilter!]) {
    element {
      list(limit: $limit, offset: $offset, filter: $filter) {
        id
        block {
          id
        }
        propertyList {
          string
          property {
            id
          }
        }

      }
    }
  }
`;

const elementItemQuery = gql`
  query GetElementItem($id: Int!) {
    element {
      item(id: $id) {
        id
        block {
          id
        }
        propertyList {
          string
          property {
            id
          }
        }
        flagString
      }
    }
  }
`;

const elementCountQuery = gql`
  query GetElementCount($limit: Int, $offset: Int) {
    element {
      count(limit: $limit, offset: $offset)
    }
  }
`;

describe('ElementQueryResolver', () => {
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

  describe('Element list', () => {
    test('Should get empty list', async () => {
      const res = await request(app.getHttpServer())
        .query(elementListQuery)
        .expectNoErrors();

      expect(res.data['element']['list']).toEqual([]);
    });

    test('Should element list', async () => {
      const block = await new BlockEntity().save();
      await Object.assign(new ElementEntity(), { block }).save();

      const res = await request(app.getHttpServer())
        .query(elementListQuery)
        .expectNoErrors();

      expect(res.data['element']['list']).toHaveLength(1);
    });

    test('Should get list with limit', async () => {
      const block = await new BlockEntity().save();
      for (let i = 0; i < 10; i++) {
        await Object.assign(new ElementEntity(), { block }).save();
      }

      const res = await request(app.getHttpServer())
        .query(elementListQuery, { limit: 5 })
        .expectNoErrors();

      expect(res.data['element']['list']).toHaveLength(5);
    });

    test('Should get list with offset', async () => {
      const block = await new BlockEntity().save();
      for (let i = 0; i < 10; i++) {
        await Object.assign(new ElementEntity(), { block }).save();
      }

      const res = await request(app.getHttpServer())
        .query(elementListQuery, { offset: 5 })
        .expectNoErrors();

      expect(res.data['element']['list']).toHaveLength(5);
      expect(res.data['element']['list'][0]['id']).toBe(6);
      expect(res.data['element']['list'][4]['id']).toBe(10);
    });
  });

  describe('Element list with filter', () => {
    test('Should get list with block filter', async () => {
      const block1 = await new BlockEntity().save();
      for (let i = 0; i < 10; i++) {
        await Object.assign(new ElementEntity(), { block: block1 }).save();
      }

      const block2 = await new BlockEntity().save();
      for (let i = 0; i < 10; i++) {
        await Object.assign(new ElementEntity(), { block: block2 }).save();
      }

      const res = await request(app.getHttpServer())
        .query(elementListQuery, {
          filter: [ {
            field: 'block',
            value: '1',
          } ],
        })
        .expectNoErrors();

      expect(res.data['element']['list']).toHaveLength(10);
    });
  });

  describe('Element item', () => {
    test('Should get element item', async () => {
      const block = await new BlockEntity().save();
      await Object.assign(new ElementEntity(), { block }).save();

      const res = await request(app.getHttpServer())
        .query(elementItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['element']['item']['id']).toBe(1);
    });

    test('Should get element with wrong id', async () => {
      const block = await new BlockEntity().save();
      await Object.assign(new ElementEntity(), { block }).save();

      const res = await request(app.getHttpServer())
        .query(elementItemQuery, { id: 88 })
        .expectNoErrors();

      expect(res.data['element']['item']).toBeNull();
    });
  });

  describe('Element count', () => {
    test('Should get zero count', async () => {
      const res = await request(app.getHttpServer())
        .query(elementCountQuery)
        .expectNoErrors();

      expect(res.data['element']['count']).toBe(0);
    });

    test('Should get element count', async () => {
      const block = await new BlockEntity().save();
      await Object.assign(new ElementEntity(), { block }).save();

      const res = await request(app.getHttpServer())
        .query(elementCountQuery)
        .expectNoErrors();

      expect(res.data['element']['count']).toBe(1);
    });
  });
});
