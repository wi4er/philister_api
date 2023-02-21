import { ElementResolver } from './element.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { Test } from '@nestjs/testing';
import { gql } from 'apollo-server-express';

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
        flagString
      }
    }
  }
`;

describe('ElementResolver', () => {
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

  test('Should', () => {

  });
});
