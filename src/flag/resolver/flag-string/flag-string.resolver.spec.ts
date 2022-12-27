import { Test } from '@nestjs/testing';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { FlagEntity } from "../../model/flag.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { FlagStringEntity } from "../../model/flag-string.entity";
import { LangEntity } from "../../../lang/model/lang.entity";

const getFlagItem = gql`
  query GetFlagItem($id: String!) {
    flag {
      item(id: $id) {
        id
        propertyList {
          id
          string
          property {
            id
          }
          
          ... on FlagString {
            lang {
              id
            }
          }
        }
      }
    }
  }
`;

describe('FlagPropertyResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Flag with property', () => {
    test('Should get flag with property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new FlagEntity(), {
        id: 'ACTIVE',
        label: 'active',
        string: []
      }).save();

      await Object.assign(new FlagStringEntity(), { string: 'VALUE', property: 'NAME', parent }).save();

      const res = await request(app.getHttpServer())
        .query(getFlagItem, { id: 'ACTIVE' })
        .expectNoErrors();

      expect(res.data['flag']['item']['propertyList']).toHaveLength(1);
      expect(res.data['flag']['item']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['flag']['item']['propertyList'][0]['property']['id']).toBe('NAME');
    });

    test('Should get flag with lang property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      const parent = await Object.assign(new FlagEntity(), {
        id: 'ACTIVE',
        label: 'active',
        string: []
      }).save();

      await Object.assign(new FlagStringEntity(), { string: 'VALUE', property: 'NAME', parent, lang }).save();

      const res = await request(app.getHttpServer())
        .query(getFlagItem, { id: 'ACTIVE' })
        .expectNoErrors();

      expect(res.data['flag']['item']['propertyList']).toHaveLength(1);
      expect(res.data['flag']['item']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['flag']['item']['propertyList'][0]['property']['id']).toBe('NAME');
      expect(res.data['flag']['item']['propertyList'][0]['lang']['id']).toBe('EN');
    });
  });
});
