import { Test } from '@nestjs/testing';
import { ElementStringResolver } from './element-string.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { BlockEntity } from '../../model/block.entity';
import { ElementEntity } from '../../model/element.entity';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { PropertyEntity } from '../../../property/model/property.entity';
import { Element2stringEntity } from '../../model/element2string.entity';

const elementItemQuery = gql`
  query GetElementItem($id: Int!) {
    element {
      item(id: $id) {
        id
        block {
          id
        }
        propertyList {
          string
          property {
            id
          }
        }
      }
    }
  }
`;

describe('ElementStringResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init();

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Element with strings', () => {
    test('Should get element with strings', async () => {
      const block = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new ElementEntity(), { block }).save();

      await Object.assign(new Element2stringEntity(), { parent, property, string: 'VALUE' }).save();

      const res = await request(app.getHttpServer())
        .query(elementItemQuery, { id: 1 })
        .expectNoErrors();

      expect(res.data['element']['item']['propertyList']).toHaveLength(1);
    })
  });
});
