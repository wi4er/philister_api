import { Test } from '@nestjs/testing';
import { UserGroupResolver } from './user-group.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { UserGroupEntity } from "../../model/user-group.entity";

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
