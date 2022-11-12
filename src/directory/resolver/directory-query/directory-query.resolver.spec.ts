import { Test } from '@nestjs/testing';
import { DirectoryQueryResolver } from './directory-query.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { DirectoryEntity } from "../../model/directory.entity";

const directoryListQuery = gql`
  query getDirectoryList($limit: Int, $offset: Int) {
    directory {
      list(limit: $limit, offset: $offset) {
        id
        property {
          id
          value
          property {
            id
          }
        }
      }
    }
  }
`;

const directoryItemQuery = gql`
  query getDirectoryList($id: String!) {
    directory {
      item(id: $id) {
        id
        property {
          id
          value
          property {
            id
          }
        }
      }
    }
  }
`;

describe('DirectoryQueryResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Property list', () => {
    test("Should get empty list", async () => {
      const res = await request(app.getHttpServer())
        .query(directoryListQuery)
        .expectNoErrors();

      expect(res.data['directory']['list']).toHaveLength(0);
    });

    test("Should get single directory list", async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .query(directoryListQuery)
        .expectNoErrors();

      expect(res.data['directory']['list']).toHaveLength(1);
      expect(res.data['directory']['list'][0]['id']).toBe('CITY');
    });

    test("Should get directory list", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new DirectoryEntity(), { id: `CITY_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(directoryListQuery)
        .expectNoErrors();

      expect(res.data['directory']['list']).toHaveLength(10);
      expect(res.data['directory']['list'][0]['id']).toBe('CITY_0');
      expect(res.data['directory']['list'][9]['id']).toBe('CITY_9');
    });
  });

  describe('Directory item', () => {
    test('Should get directory item', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .query(directoryItemQuery, { id: 'CITY' })
        .expectNoErrors();

      expect(res.data['directory']['item']['id']).toBe('CITY');
    });
  });
});
