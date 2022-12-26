import { Test } from '@nestjs/testing';
import { FlagResolver } from './flag.resolver';
import { gql } from "apollo-server-express";
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { PropertyEntity } from "../../../property/model/property.entity";
import request from "supertest-graphql";
import { FlagEntity } from "../../model/flag.entity";
import { FlagFlagEntity } from "../../model/flag-flag.entity";
import { FlagStringEntity } from "../../model/flag-string.entity";

const flagPropertyQuery = gql`
  query PropertyPropertyQuery ($id: String!){
    flag {
      item(id: $id) {
        id
        label
        flagList {
          id
          flag {
            id
          }
        }
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

const flagStringQuery = gql`
  query PropertyPropertyQuery ($id: String!, $property: String!){
    flag {
      item(id: $id) {
        id
        name: propertyString(id: $property)
      }
    }
  }
`;

describe('FlagResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Flag fields', () => {
    test('Should get flag with id', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE', label: 'active' }).save();

      const res = await request(app.getHttpServer())
        .query(flagPropertyQuery, { id: 'ACTIVE' })
        .expectNoErrors();

      expect(res.data['flag']['item']['id']).toBe('ACTIVE');
      expect(res.data['flag']['item']['label']).toBe('active');
    });

    test('Should get flag with flag', async () => {
      await Object.assign(new FlagEntity(), { id: 'STATUS', label: 'status' }).save();
      const parent = await Object.assign(new FlagEntity(), {
        id: 'ACTIVE',
        label: 'active',
      }).save();
      await Object.assign(new FlagFlagEntity(), { flag: 'STATUS', parent }).save()

      const res = await request(app.getHttpServer())
        .query(flagPropertyQuery, { id: 'ACTIVE' })
        .expectNoErrors();

      expect(res.data['flag']['item']['flagList']).toHaveLength(1);
      expect(res.data['flag']['item']['flagList'][0]['flag']['id']).toBe('STATUS');
    });
  });

  describe('Flag property', () => {
    test('Should get flag with property list', async () => {
      await Object.assign(new PropertyEntity(), { id: 'STATUS' }).save();
      const parent = await Object.assign(new FlagEntity(), {
        id: 'ACTIVE',
        label: 'active',
      }).save();
      await Object.assign(new FlagStringEntity(), { string: 'OK', property: 'STATUS', parent }).save()

      const res = await request(app.getHttpServer())
        .query(flagPropertyQuery, { id: 'ACTIVE' })
        .expectNoErrors();

      expect(res.data['flag']['item']['propertyList']).toHaveLength(1);
      expect(res.data['flag']['item']['propertyList'][0]['string']).toBe('OK');
      expect(res.data['flag']['item']['propertyList'][0]['property']['id']).toBe('STATUS');
    });

    test('Should get flag with property string', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new FlagEntity(), {
        id: 'ACTIVE',
        label: 'active',
      }).save();
      await Object.assign(new FlagStringEntity(), { string: 'active', property: 'NAME', parent }).save()

      const res = await request(app.getHttpServer())
        .query(flagStringQuery, { id: 'ACTIVE', property: 'NAME' })
        .expectNoErrors();

      expect(res.data['flag']['item']['name']).toBe('active');
    });
  });
});
