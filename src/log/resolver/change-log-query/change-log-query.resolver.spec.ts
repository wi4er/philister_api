import { Test, TestingModule } from '@nestjs/testing';
import { ChangeLogQueryResolver } from './change-log-query.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { ChangeLogEntity } from "../../model/change-log.entity";

const changeLogListQuery = gql`
  query GetChangeLogList($limit: Int, $offset: Int) {
    changeLog {
      list(limit: $limit, offset: $offset) {
        id
        created_at
        value
        field
        entity
      }
    }
  }
`;

describe('ChangeLogQueryResolver', () => {
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

      expect(res.data['changeLog']['list']).toHaveLength(0);
    });

    test("Should get populated list", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new ChangeLogEntity(), { entity: 'section', 'field': 'flag-active', value: i }).save();
      }

      const res = await request(app.getHttpServer())
        .query(changeLogListQuery)
        .expectNoErrors();

      expect(res.data['changeLog']['list']).toHaveLength(10);
    });
  });
});
