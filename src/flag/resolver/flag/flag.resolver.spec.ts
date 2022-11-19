import { Test, TestingModule } from '@nestjs/testing';
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
        flag {
          id
          flag {
            id
          }
        }
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
      await Object.assign(new FlagEntity(), {id: 'ACTIVE', label: 'active'}).save();

      const res = await request(app.getHttpServer())
        .query(flagPropertyQuery, { id: 'ACTIVE' })
        .expectNoErrors();

      expect(res.data['flag']['item']['id']).toBe('ACTIVE');
      expect(res.data['flag']['item']['label']).toBe('active');
    });

    test('Should get flag with flag', async () => {
      await Object.assign(new FlagEntity(), {id: 'STATUS', label: 'status'}).save();
      await Object.assign(new FlagEntity(), {
        id: 'ACTIVE',
        label: 'active',
        flag: [await Object.assign(new FlagFlagEntity(), {flag: 'STATUS'}).save()]
      }).save();

      const res = await request(app.getHttpServer())
        .query(flagPropertyQuery, { id: 'ACTIVE' })
        .expectNoErrors();

      expect(res.data['flag']['item']['flag']).toHaveLength(1);
      expect(res.data['flag']['item']['flag'][0]['flag']['id']).toBe('STATUS');
    });

    test('Should get flag with property', async () => {
      await Object.assign(new PropertyEntity(), {id: 'STATUS'}).save();
      await Object.assign(new FlagEntity(), {
        id: 'ACTIVE',
        label: 'active',
        property: [await Object.assign(new FlagStringEntity(), {value: 'OK', property: 'STATUS'}).save()]
      }).save();

      const res = await request(app.getHttpServer())
        .query(flagPropertyQuery, { id: 'ACTIVE' })
        .expectNoErrors();

      expect(res.data['flag']['item']['property']).toHaveLength(1);
      expect(res.data['flag']['item']['property'][0]['value']).toBe('OK');
      expect(res.data['flag']['item']['property'][0]['property']['id']).toBe('STATUS');
    });
  });
});
