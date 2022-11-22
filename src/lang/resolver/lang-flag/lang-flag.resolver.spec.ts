import { Test, TestingModule } from '@nestjs/testing';
import { LangFlagResolver } from './lang-flag.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { LangEntity } from "../../model/lang.entity";
import { FlagEntity } from "../../../flag/model/flag.entity";
import { LangFlagEntity } from "../../model/lang-flag.entity";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";

const langFlagListQuery = gql`
  query GetLangItem($id: String!) {
    lang {
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

describe('LangFlagResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));


  describe("Lang with flags", () => {
    test("Should get item with flags", async () => {
      const parent = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE', label: 'active' }).save();

      await Object.assign(new LangFlagEntity(), { parent, flag }).save();

      const res = await request(app.getHttpServer())
        .query(langFlagListQuery, { id: 'EN', property: 'NAME_2' })
        .expectNoErrors();

      expect(res.data['lang']['item']['flagList']).toHaveLength(1);
    });

    test("Should get item with flag list", async () => {
      const parent = await Object.assign(new LangEntity(), { id: 'EN' }).save();

      for (let i = 0; i < 10; i++) {
        await Object.assign(new FlagEntity(), { id: `ACTIVE_${i}`, label: 'active' }).save();
      }

      for (let i = 0; i < 10; i++) {
        await Object.assign(new LangFlagEntity(), { parent, flag: `ACTIVE_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(langFlagListQuery, { id: 'EN', property: 'NAME_2' })
        .expectNoErrors();

      expect(res.data['lang']['item']['flagList']).toHaveLength(10);
      expect(res.data['lang']['item']['flagList'][5]['flag']['id']).toBe('ACTIVE_5');
    });
  });
});
