import { Test, TestingModule } from '@nestjs/testing';
import { ValueResolver } from './value.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { DirectoryEntity } from "../../model/directory.entity";
import request from "supertest-graphql";
import { ValueEntity } from "../../model/value.entity";
import { gql } from "apollo-server-express";

const valueItemQuery = gql`
  query getValueItem($id: String!) {
    value {
      item(id: $id) {
        id
        directory {
          id
        }
      }
    }
  }
`;

describe('ValueResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe("Value fields", () => {
    test('Should get item', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), { id: 'London', directory: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .query(valueItemQuery, { id: 'London' })
        .expectNoErrors();

      expect(res.data['value']['item']['id']).toBe('London');
      expect(res.data['value']['item']['directory']['id']).toBe('CITY');
    });
  });
});
