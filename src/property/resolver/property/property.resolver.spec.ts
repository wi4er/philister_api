import { Test } from '@nestjs/testing';
import { PropertyResolver } from './property.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../model/property.entity";

const propertyPropertyQuery = gql`
  query PropertyPropertyQuery ($id: String!){
    property {
      item(id: $id) {
        id
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

describe('PropertyResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Property fields', () => {
    test('Should get property with id', async () => {
      await Object.assign(new PropertyEntity(), {id: 'TEST'}).save();

      const res = await request(app.getHttpServer())
        .query(propertyPropertyQuery, { id: 'TEST' })
        .expectNoErrors();

      expect(res.data['property']['item']['id']).toBe('TEST');
    });

  });
});
