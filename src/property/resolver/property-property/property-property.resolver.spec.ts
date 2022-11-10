import { Test } from '@nestjs/testing';
import { PropertyPropertyResolver } from './property-property.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { PropertyEntity } from '../../model/property.entity';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { createConnectionOptions } from '../../../createConnectionOptions';

const propertyPropertyListQuery = gql`
  {
    property {
      list {
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

describe('PropertyPropertyResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Property property list', () => {
    test("Should get list", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new PropertyEntity(), {
        id: 'VALUE',

      }).save();

      const res = await request(app.getHttpServer())
        .query(propertyPropertyListQuery)
        .expectNoErrors();

      expect(res.data['property']['list']).toHaveLength(2);
    });
  });
});
