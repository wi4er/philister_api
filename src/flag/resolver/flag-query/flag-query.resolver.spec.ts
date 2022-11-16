import { Test, TestingModule } from '@nestjs/testing';
import { FlagQueryResolver } from './flag-query.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { FlagEntity } from "../../model/flag.entity";

const flagListQuery = gql`
  query getFlagList($offset: Int, $limit: Int) {
    flag {
      list(offset: $offset, limit: $limit) {
        id
        property {
          value
          property {
            id
          }
        }
      }
    }
  }
`;


const flagCountQuery = gql`
  query getFlagList($offset: Int, $limit: Int) {
    flag {
      count(offset: $offset, limit: $limit)
    }
  }
`;

const flagItemQuery = gql`
  query getFlagList($id: String!) {
    flag {
      item(id: $id) {
        id
        property {
          value
          property {
            id
          }
        }
      }
    }
  }
`;

describe('FlagQueryResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Flag list', () => {
    test("Should get empty list", async () => {
      const res = await request(app.getHttpServer())
        .query(flagListQuery)
        .expectNoErrors();

      expect(res.data['flag']['list']).toHaveLength(0);
    });

    test("Should get  list", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new FlagEntity(), { id: `FLAG_${i}`, label: 'flag' }).save();
      }

      const res = await request(app.getHttpServer())
        .query(flagListQuery)
        .expectNoErrors();

      expect(res.data['flag']['list']).toHaveLength(10);
    });

    test("Should get list with limit", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new FlagEntity(), { id: `FLAG_${i}`, label: 'flag' }).save();
      }

      const res = await request(app.getHttpServer())
        .query(flagListQuery, { limit: 6 })
        .expectNoErrors();

      expect(res.data['flag']['list']).toHaveLength(6);
      expect(res.data['flag']['list'][5]['id']).toBe('FLAG_5');
    });

    test("Should get list with offset", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new FlagEntity(), { id: `FLAG_${i}`, label: 'flag' }).save();
      }

      const res = await request(app.getHttpServer())
        .query(flagListQuery, { offset: 3 })
        .expectNoErrors();

      expect(res.data['flag']['list']).toHaveLength(7);
      expect(res.data['flag']['list'][0]['id']).toBe('FLAG_3');
    });
  });

  describe('Flag count', () => {
    test('Should get count', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new FlagEntity(), { id: `FLAG_${i}`, label: 'flag' }).save();
      }

      const res = await request(app.getHttpServer())
        .query(flagCountQuery)
        .expectNoErrors();

      expect(res.data['flag']['count']).toBe(10);
    })
  });

  describe('Flag item', () => {
    test('Should get item by id', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new FlagEntity(), { id: `FLAG_${i}`, label: 'flag' }).save();
      }

      const res = await request(app.getHttpServer())
        .query(flagItemQuery, {id: 'FLAG_3'})
        .expectNoErrors();

      expect(res.data['flag']['item']['id']).toBe('FLAG_3');
    });

    test('Shouldn`t get item with wrong id', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new FlagEntity(), { id: `FLAG_${i}`, label: 'flag' }).save();
      }

      const res = await request(app.getHttpServer())
        .query(flagItemQuery, {id: 'FLAG_88'})
        .expectNoErrors();

      expect(res.data['flag']['item']).toBe(null);
    });
  });
});