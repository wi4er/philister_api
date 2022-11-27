import { Test, TestingModule } from '@nestjs/testing';
import { FetchLogQueryResolver } from './fetch-log-query.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";

const changeLogListQuery = gql`
  query GetFetchLogList($limit: Int, $offset: Int) {
    fetchLog {
      list(limit: $limit, offset: $offset) {
        id
        entity
        operation
        arguments
      }
    }
  }
`;

describe('FetchLogQueryResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Directory list', () => {
    test("Should get empty list", async () => {
      const res = await request(app.getHttpServer())
        .query(changeLogListQuery)
        .expectNoErrors();

      expect(res.data['fetchLog']['list']).toHaveLength(0);
    });
  });
});
