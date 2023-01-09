import { Test } from '@nestjs/testing';
import { UserGroupMutationResolver } from './user-group-mutation.resolver';
import { gql } from "apollo-server-express";
import request from "supertest-graphql";
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { PropertyEntity } from "../../../property/model/property.entity";
import { LangEntity } from "../../../lang/model/lang.entity";
import { UserGroupEntity } from "../../model/user-group.entity";
import { UserGroup2stringEntity } from "../../model/user-group2string.entity";
import { FlagEntity } from "../../../flag/model/flag.entity";

const userGroupAdditionMutation = gql`
  mutation AddGroupContact ($item: UserGroupInput!) {
    userGroup {
      add(item: $item) {
        id
        flagString
        propertyList {
          id
          string
          property {
            id
          }
          ... on UserGroupString {
            lang {
              id
            }
          }
        }
      }
    }
  }
`;

const userGroupUpdateMutation = gql`
  mutation UpdateUserGroup($item: UserGroupInput!) {
    userGroup {
      update(item: $item) {
        id
        flagString
        propertyList {
          id
          string
          property {
            id
          }
          ... on UserGroupString {
            lang {
              id
            }
          }
        }
      }
    }
  }
`;

describe('UserGroupMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User addition', () => {
    it('should be defined', async () => {
      const res = await request(app.getHttpServer())
        .query(userGroupAdditionMutation, {
          item: {
            flag: [],
            property: [],
          }
        })
        .expectNoErrors();

      expect(res.data['userGroup']['add']['id']).toBe(1);
      expect(res.data['userGroup']['add']['flagString']).toHaveLength(0);
      expect(res.data['userGroup']['add']['propertyList']).toHaveLength(0);
    });

    test('Should add with property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupAdditionMutation, {
          item: {
            flag: [],
            property: [{
              property: 'NAME',
              string: 'VALUE'
            }],
          }
        })
        .expectNoErrors();

      expect(res.data['userGroup']['add']['propertyList']).toHaveLength(1);
      expect(res.data['userGroup']['add']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['userGroup']['add']['propertyList'][0]['property']['id']).toBe('NAME');
    });

    test('Should add with many properties', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new PropertyEntity(), { id: `NAME_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(userGroupAdditionMutation, {
          item: {
            flag: [],
            property: [{
              property: 'NAME_2',
              string: 'VALUE_2'
            }, {
              property: 'NAME_4',
              string: 'VALUE_4'
            }, {
              property: 'NAME_6',
              string: 'VALUE_6'
            }],
          }
        })
        .expectNoErrors();

      expect(res.data['userGroup']['add']['propertyList']).toHaveLength(3);
      expect(res.data['userGroup']['add']['propertyList'][0]['string']).toBe('VALUE_2');
      expect(res.data['userGroup']['add']['propertyList'][0]['property']['id']).toBe('NAME_2');
      expect(res.data['userGroup']['add']['propertyList'][2]['string']).toBe('VALUE_6');
      expect(res.data['userGroup']['add']['propertyList'][2]['property']['id']).toBe('NAME_6');
    });

    test('Should add with lang property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupAdditionMutation, {
          item: {
            flag: [],
            property: [{
              property: 'NAME',
              string: 'VALUE',
              lang: 'EN',
            }],
          }
        })
        .expectNoErrors();

      expect(res.data['userGroup']['add']['propertyList']).toHaveLength(1);
      expect(res.data['userGroup']['add']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['userGroup']['add']['propertyList'][0]['lang']['id']).toBe('EN');
      expect(res.data['userGroup']['add']['propertyList'][0]['property']['id']).toBe('NAME');
    });
  });

  describe('User group update', () => {
    test('Should add properties to user group', async () => {
      await new UserGroupEntity().save();
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'GR' }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupUpdateMutation, {
          item: {
            id: 1,
            flag: [],
            property: [{
              property: 'NAME',
              string: 'VALUE',
              lang: 'GR',
            }],
          }
        })
        .expectNoErrors();

      expect(res.data['userGroup']['update']['propertyList']).toHaveLength(1);
      expect(res.data['userGroup']['update']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['userGroup']['update']['propertyList'][0]['property']['id']).toBe('NAME');
      expect(res.data['userGroup']['update']['propertyList'][0]['lang']['id']).toBe('GR');
    });

    test('Should change properties in user group', async () => {
      const parent = await new UserGroupEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'GR' }).save();
      await Object.assign(new UserGroup2stringEntity(), { parent, property, lang, string: 'OLD' }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupUpdateMutation, {
          item: {
            id: 1,
            flag: [],
            property: [{
              property: 'NAME',
              string: 'NEW',
              lang: 'GR',
            }],
          }
        })
        .expectNoErrors();

      expect(res.data['userGroup']['update']['propertyList']).toHaveLength(1);
      expect(res.data['userGroup']['update']['propertyList'][0]['string']).toBe('NEW');
      expect(res.data['userGroup']['update']['propertyList'][0]['property']['id']).toBe('NAME');
      expect(res.data['userGroup']['update']['propertyList'][0]['lang']['id']).toBe('GR');
    });

    test('Should add flag to user group', async () => {
      await new UserGroupEntity().save();
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new LangEntity(), { id: 'GR' }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupUpdateMutation, {
          item: {
            id: 1,
            flag: [ 'ACTIVE' ],
            property: [],
          }
        })
        .expectNoErrors();

      expect(res.data['userGroup']['update']['flagString']).toEqual([ 'ACTIVE' ]);
    });
  });
});
