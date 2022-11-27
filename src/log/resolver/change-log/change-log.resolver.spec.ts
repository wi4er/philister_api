import { Test } from '@nestjs/testing';
import { ChangeLogResolver } from './change-log.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { UserEntity } from "../../../user/model/user.entity";
import { ChangeLogEntity } from "../../model/change-log.entity";


const getChangeLogList = gql`
  query GetChangeLogList($limit: Int, $offset: Int) {
    changeLog {
      list(limit: $limit, offset: $offset) {
        id
        entity
        entityId
        value
        field
        user {
          id
          login
        }
      }
    }
  }
`;

describe('ChangeLogResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Property property list', () => {
    test("Should get empty list", async () => {
      const res = await request(app.getHttpServer())
        .query(getChangeLogList)
        .expectNoErrors();

      expect(res.data['changeLog']['list']).toHaveLength(0);
    });

    test("Should get list with single item", async () => {
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();

      await Object.assign(new ChangeLogEntity(), {
        entity: 'user',
        entityId: '1',
        field: 'id',
        value: '1',
        user,
      }).save();

      const res = await request(app.getHttpServer())
        .query(getChangeLogList)
        .expectNoErrors();

      expect(res.data['changeLog']['list']).toHaveLength(1);
      expect(res.data['changeLog']['list'][0]['id']).toBe(1);
      expect(res.data['changeLog']['list'][0]['entityId']).toBe('1');
      expect(res.data['changeLog']['list'][0]['user']['id']).toBe(1);
    });
  });
});
