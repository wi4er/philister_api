import { Test, TestingModule } from '@nestjs/testing';
import { LangQueryResolver } from './lang-query.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { LangEntity } from "../../model/lang.entity";

const langListQuery = gql`
  query GetLangList($limit: Int, $offset: Int) {
    lang {
      list(limit: $limit, offset: $offset) {
        id
        updated_at
        created_at
        version
      }
    }
  }
`;

const langCountQuery = gql`
  query GetLangList($limit: Int, $offset: Int) {
    lang {
      count(limit: $limit, offset: $offset) 
    }
  }
`;

const langItemQuery = gql`
  query GetLangItem($id: String!) {
    lang {
      item(id: $id) {
        id
        updated_at
        created_at
        version
      }
    }
  }
`;

describe('LangQueryResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Lang list', () => {
    test("Should get empty list", async () => {
      const res = await request(app.getHttpServer())
        .query(langListQuery)
        .expectNoErrors();

      expect(res.data['lang']['list']).toHaveLength(0);
    });

    test("Should get lang list", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new LangEntity(), {id: `LANG_${i}`}).save();
      }

      const res = await request(app.getHttpServer())
        .query(langListQuery)
        .expectNoErrors();

      expect(res.data['lang']['list']).toHaveLength(10);
    });

    test("Should get list with limit", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new LangEntity(), {id: `LANG_${i}`}).save();
      }

      const res = await request(app.getHttpServer())
        .query(langListQuery, {limit: 5})
        .expectNoErrors();

      expect(res.data['lang']['list']).toHaveLength(5);
      expect(res.data['lang']['list'][0]['id']).toBe('LANG_0');
      expect(res.data['lang']['list'][4]['id']).toBe('LANG_4')
    });

    test("Should get list with offset", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new LangEntity(), {id: `LANG_${i}`}).save();
      }

      const res = await request(app.getHttpServer())
        .query(langListQuery, {offset: 5})
        .expectNoErrors();

      expect(res.data['lang']['list']).toHaveLength(5);
      expect(res.data['lang']['list'][0]['id']).toBe('LANG_5');
      expect(res.data['lang']['list'][4]['id']).toBe('LANG_9')
    });
  });

  describe('Lang count', () => {
    test("Should get empty list count", async () => {
      const res = await request(app.getHttpServer())
        .query(langCountQuery)
        .expectNoErrors();

      expect(res.data['lang']['count']).toBe(0);
    });

    test("Should get lang list", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new LangEntity(), { id: `LANG_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(langCountQuery)
        .expectNoErrors();

      expect(res.data['lang']['count']).toBe(10);
    });
  });

  describe('Lang item', () => {
    test("Should get lang item", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new LangEntity(), { id: `LANG_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(langItemQuery, {id: 'LANG_5'})
        .expectNoErrors();

      expect(res.data['lang']['item']['id']).toBe('LANG_5');
    });
  });
});
