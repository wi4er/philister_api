import { Test, TestingModule } from '@nestjs/testing';
import { DirectoryResolver } from './directory.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { DirectoryEntity } from "../../model/directory.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { DirectoryPropertyEntity } from "../../model/directory-property.entity";
import { ValueEntity } from "../../model/value.entity";

const directoryItemQuery = gql`
  query getDirectoryItem($id: String!) {
    directory {
      item(id: $id) {
        id
        property {
          value
          property {
            id
          }
        }
        value {
          id
          directory {
            id
          }
        }
      }
    }
  }
`;

describe('DirectoryResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe("Directory fields", () => {
    test('Should get item', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .query(directoryItemQuery, { id: 'CITY' })
        .expectNoErrors();

      expect(res.data['directory']['item']['id']).toBe('CITY');
      expect(res.data['directory']['item']['property']).toEqual([]);
      expect(res.data['directory']['item']['value']).toEqual([]);
    });
  });

  describe('Directory with property', () => {
    test('Should get with property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new DirectoryEntity(), {
        id: 'CITY',
        property: [
          await Object.assign(new DirectoryPropertyEntity(), { value: 'City name', property: 'NAME' }).save(),
        ]
      }).save();

      const res = await request(app.getHttpServer())
        .query(directoryItemQuery, { id: 'CITY' })
        .expectNoErrors();

      expect(res.data['directory']['item']['property']).toHaveLength(1);
      expect(res.data['directory']['item']['property'][0]['value']).toBe('City name');
      expect(res.data['directory']['item']['property'][0]['property']['id']).toBe('NAME');
    });
  });

  describe('Directory with value', () => {
    test('Should get with property', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), { id: 'NewYork', directory: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .query(directoryItemQuery, { id: 'CITY' })
        .expectNoErrors();

      expect(res.data['directory']['item']['value']).toHaveLength(1);
      expect(res.data['directory']['item']['value'][0]['id']).toBe('NewYork');
      expect(res.data['directory']['item']['value'][0]['directory']['id']).toBe('CITY');
    });
  });
});
