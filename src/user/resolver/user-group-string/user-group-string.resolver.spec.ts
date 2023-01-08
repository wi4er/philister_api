import { Test } from '@nestjs/testing';
import { UserGroupStringResolver } from './user-group-string.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { UserGroupEntity } from "../../model/user-group.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserGroup2stringEntity } from "../../model/user-group2string.entity";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";

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

describe('UserGroupStringResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User Group with strings', () => {
    test('Should get with property', async () => {
      await new UserGroupEntity().save();
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new UserGroup2stringEntity(), { parent: 1, property: 'NAME', string: 'VALUE' }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['userGroup']['item']['propertyList']).toHaveLength(1);
      expect(res.data['userGroup']['item']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['userGroup']['item']['propertyList'][0]['property']['id']).toBe('NAME');
    });

    test('Should get with many properties', async () => {
      await new UserGroupEntity().save();
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new PropertyEntity(), { id: 'SECOND' }).save();
      await Object.assign(new UserGroup2stringEntity(), { parent: 1, property: 'NAME', string: 'VALUE_1' }).save();
      await Object.assign(new UserGroup2stringEntity(), { parent: 1, property: 'SECOND', string: 'VALUE_2' }).save();

      const res = await request(app.getHttpServer())
        .query(userGroupItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['userGroup']['item']['propertyList']).toHaveLength(2);
      expect(res.data['userGroup']['item']['propertyList'][0]['string']).toBe('VALUE_1');
      expect(res.data['userGroup']['item']['propertyList'][0]['property']['id']).toBe('NAME');
      expect(res.data['userGroup']['item']['propertyList'][1]['string']).toBe('VALUE_2');
      expect(res.data['userGroup']['item']['propertyList'][1]['property']['id']).toBe('SECOND');
    });
  });
});
