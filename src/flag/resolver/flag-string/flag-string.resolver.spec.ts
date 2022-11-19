import { Test, TestingModule } from '@nestjs/testing';
import { FlagStringResolver } from './flag-string.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { FlagEntity } from "../../model/flag.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { FlagStringEntity } from "../../model/flag-string.entity";

const getFlagItem = gql`
  query GetFlagItem($id: String!) {
    flag {
      item(id: $id) {
        id
        property {
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

describe('FlagPropertyResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Flag with property', () => {
    test("Should get flag with property list", async () => {
      await Object.assign(new PropertyEntity(), {id: 'NAME'}).save();
      await Object.assign(new FlagEntity(), {
        id: 'ACTIVE',
        label: 'active',
        string: [
          await Object.assign(new FlagStringEntity(), {string: 'VALUE', property: 'NAME'}).save(),
        ]
      }).save();

      const res = await request(app.getHttpServer())
        .query(getFlagItem, {id: 'ACTIVE'})
        .expectNoErrors();

      console.dir(res.data['flag']['item'], {depth: 5});

      // expect(res.data['flag']['list']).toHaveLength(0);
    });
  });
});
