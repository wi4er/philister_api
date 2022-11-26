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

const updateLangMutation = gql`
  mutation updateLang($item: LangInput!) {
    lang {
      update(item: $item) {
        id
        propertyList {
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

        flagString
      }
    }
  }
`;

const deleteLangListMutation = gql`
  mutation deleteLangList($id: [String!]!) {
    lang {
      delete(id: $id)
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
          item: { id: 'FR', flag: [ 'ACTIVE' ] }
        })
        .expectNoErrors();

      expect(res.data['lang']['add']['id']).toBe('FR');
      expect(res.data['lang']['add']['flagString']).toHaveLength(1);
      expect(res.data['lang']['add']['flagString'][0]).toBe('ACTIVE')
    });
  });

  describe('Lang update with properties', () => {
    test("Should add properties to lang", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(new LangEntity(), { id: 'FR' }).save();

      const res = await request(app.getHttpServer())
        .query(updateLangMutation, {
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

      expect(res.data['lang']['update']['propertyList']).toHaveLength(1);
      expect(res.data['lang']['update']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['lang']['update']['propertyList'][0]['property']['id']).toBe('NAME');
    });

    test("Should update properties in lang", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(new LangEntity(), { id: 'FR' }).save();

      await request(app.getHttpServer())
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

      const res = await request(app.getHttpServer())
        .query(updateLangMutation, {
          item: {
            id: 'FR',
            property: [ {
              string: 'UPDATE',
              property: 'NAME',
              lang: 'EN',
            } ]
          }
        })
        .expectNoErrors();

      expect(res.data['lang']['update']['propertyList']).toHaveLength(1);
      expect(res.data['lang']['update']['propertyList'][0]['string']).toBe('UPDATE');
      expect(res.data['lang']['update']['propertyList'][0]['property']['id']).toBe('NAME');
    });

    test("Should update multi properties in lang", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(new LangEntity(), { id: 'FR' }).save();

      await request(app.getHttpServer())
        .query(addLangMutation, {
          item: {
            id: 'FR',
            property: [ {
              string: 'VALUE_1',
              property: 'NAME',
              lang: 'EN',
            }, {
              string: 'VALUE_2',
              property: 'NAME',
              lang: 'EN',
            } ]
          }
        })
        .expectNoErrors();

      const res = await request(app.getHttpServer())
        .query(updateLangMutation, {
          item: {
            id: 'FR',
            property: [ {
              string: 'UPDATE_1',
              property: 'NAME',
              lang: 'EN',
            }, {
              string: 'UPDATE_2',
              property: 'NAME',
              lang: 'EN',
            } ]
          }
        })
        .expectNoErrors();

      expect(res.data['lang']['update']['propertyList']).toHaveLength(2);
      expect(res.data['lang']['update']['propertyList'][0]['string']).toBe('UPDATE_1');
      expect(res.data['lang']['update']['propertyList'][0]['property']['id']).toBe('NAME');
      expect(res.data['lang']['update']['propertyList'][1]['string']).toBe('UPDATE_2');
      expect(res.data['lang']['update']['propertyList'][1]['property']['id']).toBe('NAME');
    });

    test("Should delete properties in lang", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(new LangEntity(), { id: 'FR' }).save();

      await request(app.getHttpServer())
        .query(addLangMutation, {
          item: {
            id: 'FR',
            property: [ {
              string: 'VALUE_1',
              property: 'NAME',
              lang: 'EN',
            }, {
              string: 'VALUE_2',
              property: 'NAME',
              lang: 'EN',
            } ]
          }
        })
        .expectNoErrors();

      const res = await request(app.getHttpServer())
        .query(updateLangMutation, {
          item: {
            id: 'FR',
            property: []
          }
        })
        .expectNoErrors();

      expect(res.data['lang']['update']['propertyList']).toHaveLength(0);
    });

    test("Should update and delete multi properties in lang", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new PropertyEntity(), { id: 'GENDER' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(new LangEntity(), { id: 'FR' }).save();

      await request(app.getHttpServer())
        .query(addLangMutation, {
          item: {
            id: 'FR',
            property: [ {
              string: 'VALUE_1',
              property: 'NAME',
              lang: 'EN',
            }, {
              string: 'VALUE_2',
              property: 'NAME',
              lang: 'EN',
            }, {
              string: 'VALUE_2',
              property: 'GENDER',
              lang: 'EN',
            }, {
              string: 'VALUE_2',
              property: 'GENDER',
              lang: 'EN',
            } ]
          }
        })
        .expectNoErrors();

      const res = await request(app.getHttpServer())
        .query(updateLangMutation, {
          item: {
            id: 'FR',
            property: [ {
              string: 'VALUE_1',
              property: 'NAME',
              lang: 'EN',
            }, {
              string: 'UPDATE_2',
              property: 'GENDER',
              lang: 'EN',
            } ]
          }
        })
        .expectNoErrors();

      expect(res.data['lang']['update']['propertyList']).toHaveLength(2);
      expect(res.data['lang']['update']['propertyList'][0]['string']).toBe('VALUE_1');
      expect(res.data['lang']['update']['propertyList'][0]['property']['id']).toBe('NAME');
      expect(res.data['lang']['update']['propertyList'][1]['string']).toBe('UPDATE_2');
      expect(res.data['lang']['update']['propertyList'][1]['property']['id']).toBe('GENDER');
    });
  });

  describe('Lang update with flags', () => {
    test("Should add flag to lang", async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE', label: 'active' }).save();
      await Object.assign(new LangEntity(), { id: 'FR' }).save();

      const res = await request(app.getHttpServer())
        .query(updateLangMutation, {
          item: { id: 'FR', flag: [ 'ACTIVE' ] }
        })
        .expectNoErrors();

      expect(res.data['lang']['update']['flagString']).toHaveLength(1);
      expect(res.data['lang']['update']['flagString'][0]).toBe('ACTIVE');
    });

    test("Should update flag in lang", async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE', label: 'active' }).save();
      await Object.assign(new FlagEntity(), { id: 'PASSIVE', label: 'passive' }).save();
      await Object.assign(new LangEntity(), { id: 'FR' }).save();

      await request(app.getHttpServer())
        .query(addLangMutation, {
          item: { id: 'FR', flag: [ 'ACTIVE' ] }
        })
        .expectNoErrors();

      const res = await request(app.getHttpServer())
        .query(updateLangMutation, {
          item: { id: 'FR', flag: [ 'PASSIVE' ] }
        })
        .expectNoErrors();

      expect(res.data['lang']['update']['flagString']).toHaveLength(1);
      expect(res.data['lang']['update']['flagString'][0]).toBe('PASSIVE');
    });

    test("Should delete flags in lang", async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE', label: 'active' }).save();
      await Object.assign(new FlagEntity(), { id: 'PASSIVE', label: 'passive' }).save();
      await Object.assign(new LangEntity(), { id: 'FR' }).save();

      await request(app.getHttpServer())
        .query(addLangMutation, {
          item: { id: 'FR', flag: [ 'ACTIVE', 'PASSIVE' ] }
        })
        .expectNoErrors();

      const res = await request(app.getHttpServer())
        .query(updateLangMutation, {
          item: { id: 'FR', flag: [] }
        })
        .expectNoErrors();

      expect(res.data['lang']['update']['flagString']).toHaveLength(0);
    });
  });

  describe('Lang deletion', () => {
    test('Should delete lang', async () => {
      await Object.assign(new LangEntity(), { id: 'EN' }).save();

      const res = await request(app.getHttpServer())
        .query(deleteLangListMutation, { id: [ 'EN' ] })
        .expectNoErrors();

      expect(res.data['lang']['delete']).toEqual([ 'EN' ]);
    });

    test('Should delete lang list', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new LangEntity(), { id: `LANG_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(deleteLangListMutation, { id: [ 'LANG_0', 'LANG_3', 'LANG_5' ] })
        .expectNoErrors();

      expect(res.data['lang']['delete']).toEqual([ 'LANG_0', 'LANG_3', 'LANG_5' ]);
    });
  });
});
