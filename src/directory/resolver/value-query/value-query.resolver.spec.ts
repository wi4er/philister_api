import { Test } from '@nestjs/testing';
import { ValueQueryResolver } from './value-query.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";

const valueListQuery = gql`
  query getValueList($limit: Int, $offset: Int) {
    value {
      list(limit: $limit, offset: $offset) {
        id
        directory {
          id
        }
      }
    }
  }
`;

describe('ValueQueryResolver', () => {
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

  describe('Value list', () => {
    test("Should get empty list", async () => {
      const res = await request(app.getHttpServer())
        .query(valueListQuery)
        .expectNoErrors();

      expect(res.data['value']['list']).toHaveLength(0);
    });
  });
});
