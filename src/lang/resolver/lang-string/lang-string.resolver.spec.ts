import { Test, TestingModule } from '@nestjs/testing';
import { LangStringResolver } from './lang-string.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { LangEntity } from "../../model/lang.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { LangStringEntity } from "../../model/lang-string.entity";

const langStringQuery = gql`
  query GetLangString($id: String!, $property: String!) {
    lang {
      item(id: $id) {
        id
        propertyItem(id: $property) {
          id
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
`

describe('LangStringResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('LangString fields', () => {
    test('Should get without lang', async () => {
      const parent = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      for (let i = 0; i < 5; i++) {
        await Object.assign(new LangStringEntity(), { parent, property, string: `VALUE_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(langStringQuery, {id: 'EN', property: 'NAME'})
        .expectNoErrors();

      expect(res.data['lang']['item']['propertyItem']['lang']).toBeNull();
    });
  });

  describe('Lang with strings', () => {
    test("Should get with string list", async () => {
      const parent = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      for (let i = 0; i < 5; i++) {
        await Object.assign(new LangStringEntity(), { parent, property, lang: parent, string: `VALUE_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(langStringQuery, {id: 'EN', property: 'NAME'})
        .expectNoErrors();

      expect(res.data['lang']['item']['propertyItem']['property']['id']).toBe('NAME');
      expect(res.data['lang']['item']['propertyItem']['lang']['id']).toBe('EN');
    });
  });
});
