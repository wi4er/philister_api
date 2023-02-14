import { Test, TestingModule } from '@nestjs/testing';
import { BlockQueryResolver } from './block-query.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { BlockEntity } from "../../model/block.entity";

const blockListQuery = gql`
  query getBlockList($limit: Int, $offset: Int) {
    block {
      list(limit: $limit, offset: $offset) {
        id
        version
        updated_at
        created_at
      }
    }
  }
`;

const blockCountQuery = gql`
  query getBlockCount($limit: Int, $offset: Int) {
    block {
      count(limit: $limit, offset: $offset)
    }
  }
`;

const blockItemQuery = gql`
  query getBlockItem($id: Int!) {
    block {
      item(id: $id) {
        id
        version
        updated_at
        created_at
      }
    }
  }
`;

describe('BlockQueryResolver', () => {
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

  describe('Block list', () => {
    test("Should get empty list", async () => {
      const res = await request(app.getHttpServer())
        .query(blockListQuery)
        .expectNoErrors();

      expect(res.data['block']['list']).toHaveLength(0);
    });

    test("Should get list", async () => {
      for (let i = 0; i < 10; i++) {
        await new BlockEntity().save();
      }

      const res = await request(app.getHttpServer())
        .query(blockListQuery)
        .expectNoErrors();

      expect(res.data['block']['list']).toHaveLength(10);
    });
  });

  describe('Block count', () => {
    test("Should get zero count", async () => {
      const res = await request(app.getHttpServer())
        .query(blockCountQuery)
        .expectNoErrors();

      expect(res.data['block']['count']).toBe(0);
    });

    test("Should get count", async () => {
      for (let i = 0; i < 10; i++) {
        await new BlockEntity().save();
      }

      const res = await request(app.getHttpServer())
        .query(blockCountQuery)
        .expectNoErrors();

      expect(res.data['block']['count']).toBe(10);
    });
  });

  describe('Block item', () => {
    test("Should get item with wrong id", async () => {
      for (let i = 0; i < 10; i++) {
        await new BlockEntity().save();
      }

      const res = await request(app.getHttpServer())
        .query(blockItemQuery, { id: 11 })
        .expectNoErrors();

      expect(res.data['block']['item']).toBeNull();
    });

    test("Should get item", async () => {
      for (let i = 0; i < 10; i++) {
        await new BlockEntity().save();
      }

      const res = await request(app.getHttpServer())
        .query(blockItemQuery, { id: 5 })
        .expectNoErrors();

      expect(res.data['block']['item']['id']).toBe(5);
    });
  });
});
