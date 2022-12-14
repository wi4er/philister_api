import { Test } from '@nestjs/testing';
import { LangResolver } from './lang.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { LangEntity } from "../../model/lang.entity";
import { LangStringEntity } from "../../model/lang-string.entity";
import { PropertyEntity } from "../../../property/model/property.entity";

const langPropertyListQuery = gql`
  query GetLangItem($id: String!) {
    lang {
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

const langPropertyItemQuery = gql`
  query GetLangItem($id: String!, $property: String!) {
    lang {
      item(id: $id) {
        id
        propertyItem(id: $property){
          id
          string
          property {
            id
          }
          ... on LangString {
            lang {
              id
            }
          }
        }
      }
    }
  }
`;


describe('LangResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Lang item with properties', () => {
    test("Should get empty list", async () => {
      await Object.assign(new LangEntity(), { id: 'EN' }).save();

      const res = await request(app.getHttpServer())
        .query(langPropertyListQuery, { id: 'EN' })
        .expectNoErrors();

      expect(res.data['lang']['item']['propertyList']).toHaveLength(0);
    });

    test("Should get list", async () => {
      const parent = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      for (let i = 0; i < 5; i++) {
        await Object.assign(new LangStringEntity(), { parent, property, lang: parent, string: `VALUE_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(langPropertyListQuery, { id: 'EN' })
        .expectNoErrors();

      expect(res.data['lang']['item']['propertyList']).toHaveLength(5);
    });

    test("Should get item with strings", async () => {
      const parent = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      for (let i = 0; i < 5; i++) {
        await Object.assign(new PropertyEntity(), { id: `NAME_${i}` }).save();
      }

      for (let i = 0; i < 5; i++) {
        await Object.assign(new LangStringEntity(), {
          parent,
          property: `NAME_${i}`,
          lang: parent,
          string: `VALUE_${i}`
        }).save();
      }

      const res = await request(app.getHttpServer())
        .query(langPropertyItemQuery, { id: 'EN', property: 'NAME_2' })
        .expectNoErrors();

      expect(res.data['lang']['item']['propertyItem']['property']['id']).toBe('NAME_2');
      expect(res.data['lang']['item']['propertyItem']['string']).toBe('VALUE_2');
      expect(res.data['lang']['item']['propertyItem']['lang']['id']).toBe('EN');
    });
  });

});
