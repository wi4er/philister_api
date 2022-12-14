import { Test } from '@nestjs/testing';
import { BlockResolver } from './block.resolver';
import { gql } from "apollo-server-express";
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { BlockEntity } from "../../model/block.entity";
import { ElementEntity } from "../../model/element.entity";
import { SectionEntity } from "../../model/section.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { BlockStringEntity } from "../../model/block-string.entity";

const blockItemQuery = gql`
  query getBlockItem($id: Int!) {
    block {
      item(id: $id) {
        id
        version
        updated_at
        created_at
        element {
          id
        }
        section {
          id
        }
      }
    }
  }
`;

const blockStringPropertyQuery = gql`
  query getBlockItem($id: Int!, $property: String!) {
    block {
      item(id: $id) {
        id
        propertyString(id: $property)
      }
    }
  }
`;

describe('BlockResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Block elements', () => {
    test('Should get block with element', async () => {
      const block = await new BlockEntity().save();
      const element = await Object.assign(new ElementEntity(), { block }).save();

      const res = await request(app.getHttpServer())
        .query(blockItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['block']['item']['element']).toHaveLength(1);
      expect(res.data['block']['item']['element'][0]['id']).toBe(1);
    });
  });

  describe('Block sections', () => {
    test('Should get block with section', async () => {
      const block = await new BlockEntity().save();
      const section = await Object.assign(new SectionEntity(), { block }).save();

      const res = await request(app.getHttpServer())
        .query(blockItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['block']['item']['section']).toHaveLength(1);
      expect(res.data['block']['item']['section'][0]['id']).toBe(1);
    });
  });

  describe('Block properties', () => {
    test('Should get block with property string', async () => {
      const parent = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      await Object.assign(
        new BlockStringEntity(),
        { string: 'VALUE', property, parent }
      ).save();

      const res = await request(app.getHttpServer())
        .query(blockStringPropertyQuery, { id: 1, property: 'NAME' })
        .expectNoErrors();

      expect(res.data['block']['item']['propertyString']).toBe('VALUE');
    });

    test('Shouldn`t get block with wrong property', async () => {
      const parent = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new BlockStringEntity(), { string: 'VALUE', property, parent }).save();

      const res = await request(app.getHttpServer())
        .query(blockStringPropertyQuery, { id: 1, property: 'WRONG' })
        .expectNoErrors();

      expect(res.data['block']['item']['propertyString']).toBeNull();
    });
  });
});
