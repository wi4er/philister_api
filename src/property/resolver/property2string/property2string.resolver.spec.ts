import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { PropertyEntity } from '../../model/property.entity';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { Property2stringEntity } from '../../model/property2string.entity';

const propertyItemQuery = gql`
  query getPropertyItem($id: String!) {
    property {
      item (id: $id) {
        id
        propertyList {
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

describe('Property2String Resolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init();

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Property property list', () => {
    test('Should get list', async () => {
      const parent = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const property = await Object.assign(new PropertyEntity(), { id: 'PROPERTY' }).save();
      await Object.assign(
        new Property2stringEntity(),
        {
          string: 'VALUE',
          property,
          parent,
        }
      ).save();

      const res = await request(app.getHttpServer())
        .query(propertyItemQuery, { id: 'PROPERTY' })
        .expectNoErrors();

      console.log(res.data['property']['item']);

      // expect(res.data['property']['item']).toHaveLength(2);
    });
  });
});
