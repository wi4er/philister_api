import { Test } from '@nestjs/testing';
import { UserGroupQueryResolver } from './user-group-query.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { UserGroupEntity } from "../../model/user-group.entity";

const userGroupListQuery = gql`
  query getUserGroupList($limit: Int, $offset: Int) {
    userGroup {
      list(limit: $limit, offset: $offset) {
        id
      }
    }
  }
`;

const userGroupCountQuery = gql`
  query getUserGroupCount($limit: Int, $offset: Int) {
    userGroup {
      count(limit: $limit, offset: $offset)
    }
  }
`;

const userGroupItemQuery = gql`
  query getUserGroupItem($id: Int!) {
    userGroup {
      item(id: $id) {
        id
      }
    }
  }
`;

describe('UserGroupQueryResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User Group list', () => {
    it('Should get empty list', async () => {
      const res = await request(app.getHttpServer())
        .query(userGroupListQuery)
        .expectNoErrors()

      expect(res.data['userGroup']['list']).toEqual([]);
    });

    it('Should get list', async () => {
      for (let i = 0; i < 10; i++) {
        await new UserGroupEntity().save();
      }

      const res = await request(app.getHttpServer())
        .query(userGroupListQuery)
        .expectNoErrors()

      expect(res.data['userGroup']['list']).toHaveLength(10);
    });
  });

  describe('User Group item', () => {
    test('Should get item', async () => {
      await new UserGroupEntity().save();

      const res = await request(app.getHttpServer())
        .query(userGroupItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['userGroup']['item']['id']).toBe(1);
    });

    test('Should get with wrong id', async () => {
      await new UserGroupEntity().save();

      const res = await request(app.getHttpServer())
        .query(userGroupItemQuery, { id: 1111 })
        .expectNoErrors();

      expect(res.data['userGroup']['item']).toBeNull();
    });
  });

  describe('User Group count', () => {
    test('Should get 0 count', async () => {
      const res = await request(app.getHttpServer())
        .query(userGroupCountQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['userGroup']['count']).toBe(0);
    });

    test('Should get single count', async () => {
      await new UserGroupEntity().save();

      const res = await request(app.getHttpServer())
        .query(userGroupCountQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['userGroup']['count']).toBe(1);
    });
  });
});
