import { Test, TestingModule } from '@nestjs/testing';
import { ValueStringResolver } from './value-string.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../../property/model/property.entity";
import { DirectoryEntity } from "../../model/directory.entity";
import { ValueEntity } from "../../model/value.entity";
import { ValueStringEntity } from "../../model/value.string.entity";

const valuePropertyListQuery = gql`
  query GetValueProperty ($id: String!) {
    value {
      item(id: $id) {
        id
        propertyList {
          id
          string
          property {
            id
          }
        }
      }
    }
  }
`;

const valuePropertyItemQuery = gql`
  query GetValueProperty ($id: String!, $property: String!) {
    value {
      item(id: $id) {
        id
        name: propertyItem(id: $property) {
          id
          string
          property {
            id
          }
        }
      }
    }
  }
`;

const valuePropertyStringQuery = gql`
  query GetValueProperty ($id: String!, $property: String!) {
    value {
      item(id: $id) {
        id
        name: propertyString(id: $property) 
      }
    }
  }
`;

describe('ValueStringResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Value properties', () => {
    test("Should get item with property", async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();
      const parent = await Object.assign(new ValueEntity(), { id: 'ITEM', directory, property }).save();

      await Object.assign(new ValueStringEntity(), {
        string: 'VALUE', property, parent
      }).save();

      const res = await request(app.getHttpServer())
        .query(valuePropertyListQuery, { id: 'ITEM' })
        .expectNoErrors();

      expect(res.data['value']['item']['propertyList']).toHaveLength(1);
      expect(res.data['value']['item']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['value']['item']['propertyList'][0]['property']['id']).toBe('NAME');
    });

    test("Should get item with property item", async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();
      const parent = await Object.assign(new ValueEntity(), { id: 'ITEM', directory, property }).save();

      await Object.assign(new ValueStringEntity(), {
        string: 'VALUE', property, parent
      }).save();

      const res = await request(app.getHttpServer())
        .query(valuePropertyItemQuery, { id: 'ITEM', property: 'NAME' })
        .expectNoErrors();

      expect(res.data['value']['item']['name']['string']).toBe('VALUE');
      expect(res.data['value']['item']['name']['property']['id']).toBe('NAME');
    });

    test("Should get item property value", async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();
      const parent = await Object.assign(new ValueEntity(), { id: 'ITEM', directory, property }).save();

      await Object.assign(new ValueStringEntity(), {
        string: 'VALUE', property, parent
      }).save();

      const res = await request(app.getHttpServer())
        .query(valuePropertyStringQuery, { id: 'ITEM', property: 'NAME' })
        .expectNoErrors();

      expect(res.data['value']['item']['name']).toBe('VALUE');
    });
  });
});