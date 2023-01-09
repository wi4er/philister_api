import { Test } from '@nestjs/testing';
import { UserGroupResolver } from './user-group.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { UserGroupEntity } from "../../model/user-group.entity";
import { UserGroup2stringEntity } from "../../model/user-group2string.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { LangEntity } from "../../../lang/model/lang.entity";

const userGroupItemQuery = gql`
  query getUserGroupItem($id: Int!) {
    userGroup {
      item(id: $id) {
        id
        parent {
          id
        }
        
        children {
          id
        }
      }
    }
  }
`;

const userGroupPropertyStringQuery = gql`
  query getUserGroupItem($id: Int!, $property: String!, $lang: String) {
    userGroup {
      item(id: $id) {
        id
        propertyString(id: $property, lang: $lang)
      }
    }
  }
`;

describe('UserGroupResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('UserGroup properties', () => {
    test('Should get property string', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await new UserGroupEntity().save();
      await Object.assign(new UserGroup2stringEntity(), { parent, property, string: 'VALUE' }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupPropertyStringQuery, { id: 1, property: 'NAME' })
        .expectNoErrors()

      expect(res.data['userGroup']['item']['propertyString']).toBe('VALUE');
    });

    test('Should get property lang string', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await new UserGroupEntity().save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(new UserGroup2stringEntity(), { parent, property, string: 'WRONG' }).save();
      await Object.assign(new UserGroup2stringEntity(), { parent, property, lang, string: 'VALUE' }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupPropertyStringQuery, { id: 1, property: 'NAME', lang: 'EN' })
        .expectNoErrors()

      expect(res.data['userGroup']['item']['propertyString']).toBe('VALUE');
    });
  });

  describe('UserGroup parent', () => {
    it('Should get group with parent', async () => {
      const parent = await new UserGroupEntity().save();
      await Object.assign(new UserGroupEntity(), { parent }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupItemQuery, { id: 2 })
        .expectNoErrors()

      expect(res.data['userGroup']['item']['id']).toBe(2);
      expect(res.data['userGroup']['item']['parent']['id']).toBe(1);
    });

    it('Should get group with children', async () => {
      const parent = await new UserGroupEntity().save();
      const child = await Object.assign(new UserGroupEntity(), { parent }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupItemQuery, { id: 1 })
        .expectNoErrors()

      expect(res.data['userGroup']['item']['id']).toBe(1);
      expect(res.data['userGroup']['item']['children']).toHaveLength(1);
      expect(res.data['userGroup']['item']['children'][0]['id']).toBe(2);
    });
  });
});
