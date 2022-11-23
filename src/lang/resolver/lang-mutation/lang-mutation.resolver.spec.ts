import { Test } from '@nestjs/testing';
import { LangMutationResolver } from './lang-mutation.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../../property/model/property.entity";
import { LangEntity } from "../../model/lang.entity";
import { FlagEntity } from "../../../flag/model/flag.entity";

const addLangMutation = gql`
  mutation addLang($item: LangInput!) {
    lang {
      add(item: $item) {
        id
        propertyList {
          id
          string
          property {
            id
          }
        }
        
        flagString
      }
    }
  }
`;

describe('LangMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Lang add', () => {
    test("Should add item", async () => {
      const res = await request(app.getHttpServer())
        .query(addLangMutation, { item: { id: 'FR' } })
        .expectNoErrors();

      expect(res.data['lang']['add']['id']).toBe('FR');
    });

    test("Should add with properties", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();

      const res = await request(app.getHttpServer())
        .query(addLangMutation, {
          item: {
            id: 'FR',
            property: [ {
              string: 'VALUE',
              property: 'NAME',
              lang: 'EN',
            } ]
          }
        })
        .expectNoErrors();

      expect(res.data['lang']['add']['id']).toBe('FR');
      expect(res.data['lang']['add']['propertyList']).toHaveLength(1);
      expect(res.data['lang']['add']['propertyList'][0]['string']).toBe('VALUE')
    });

    test("Should add with flag", async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE', label: 'active' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();

      const res = await request(app.getHttpServer())
        .query(addLangMutation, {
          item: {
            id: 'FR',
            flag: [ 'ACTIVE' ],
          }
        })
        .expectNoErrors();

      expect(res.data['lang']['add']['id']).toBe('FR');
      expect(res.data['lang']['add']['flagString']).toHaveLength(1);
      expect(res.data['lang']['add']['flagString'][0]).toBe('ACTIVE')
    });
  });
});
