import { Test, TestingModule } from '@nestjs/testing';
import { FlagFlagResolver } from './flag-flag.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { FlagEntity } from "../../model/flag.entity";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { FlagFlagEntity } from "../../model/flag-flag.entity";

const flagItemQuery = gql`
  query FlagItem ($id: String!){
    flag {
      item(id: $id) {
        id
        flagList {
          id
          flag {
            id
          }
        }
      }
    }
  }
`;

describe('FlagFlagResolver', () => {
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
      const parent = await Object.assign(new FlagEntity(), { id: 'FLAG', label: 'active' }).save();
      await Object.assign(new FlagFlagEntity(), { flag: 'ACTIVE', parent }).save();

      const res = await request(app.getHttpServer())
        .query(flagItemQuery, { id: 'FLAG' })
        .expectNoErrors();

      expect(res.data['flag']['item']['id']).toBe('FLAG');
    });
  });
});
