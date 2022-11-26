import { Test, TestingModule } from '@nestjs/testing';
import { BlockStringResolver } from './block-string.resolver';
import { gql } from "apollo-server-express";
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { BlockEntity } from "../../model/block.entity";
import { BlockStringEntity } from "../../model/block-string.entity";
import { PropertyEntity } from "../../../property/model/property.entity";

const propertyListQuery = gql`
  query getPropertyList($id: Int!) {
    block {
      item(id: $id) {
        id
        version
        updated_at
        created_at
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

const propertyItemQuery = gql`
  query getPropertyList($id: Int!, $property: String!) {
    block {
      item(id: $id) {
        id
        version
        updated_at
        created_at
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

describe('BlockStringResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Block with properties', () => {
    test("Should get property list", async () => {
      const parent = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      await Object.assign(new BlockStringEntity(), { parent, property, string: 'VALUE' }).save();

      const res = await request(app.getHttpServer())
        .query(propertyListQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['block']['item']['propertyList']).toHaveLength(1)
      expect(res.data['block']['item']['propertyList'][0]['string']).toBe('VALUE');
    });

    test("Should get property item", async () => {
      const parent = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      await Object.assign(new BlockStringEntity(), { parent, property, string: 'VALUE' }).save();

      const res = await request(app.getHttpServer())
        .query(propertyItemQuery, { id: 1, property: 'NAME' })
        .expectNoErrors();

      expect(res.data['block']['item']['name']['string']).toBe('VALUE');
    });
  });
});
