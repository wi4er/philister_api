import { Test } from '@nestjs/testing';
import { DirectoryResolver } from './directory.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { DirectoryEntity } from '../../model/directory.entity';
import { PropertyEntity } from '../../../property/model/property.entity';
import { Directory2stringEntity } from '../../model/directory2string.entity';
import { ValueEntity } from '../../model/value.entity';
import { LangEntity } from '../../../lang/model/lang.entity';

const directoryItemQuery = gql`
  query getDirectoryItem($id: String!) {
    directory {
      item(id: $id) {
        id
        created_at
        updated_at
        version
        property {
          string
          property {
            id
          }

          ... on DirectoryString {
            lang {
              id
            }
          }
        }
        value {
          id
          directory {
            id
          }
        }
      }
    }
  }
`;

describe('DirectoryResolver', () => {
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

  describe('Directory fields', () => {
    test('Should get item', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .query(directoryItemQuery, { id: 'CITY' })
        .expectNoErrors();

      expect(res.data['directory']['item']['id']).toBe('CITY');
      expect(res.data['directory']['item']['property']).toEqual([]);
      expect(res.data['directory']['item']['value']).toEqual([]);
    });
  });

  describe('Directory with property', () => {
    test('Should get with property', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();

      await Object.assign(new Directory2stringEntity(), { string: 'City name', property, parent, lang }).save();

      const res = await request(app.getHttpServer())
        .query(directoryItemQuery, { id: 'CITY' })
        .expectNoErrors();

      expect(res.data['directory']['item']['property']).toHaveLength(1);
      expect(res.data['directory']['item']['property'][0]['string']).toBe('City name');
      expect(res.data['directory']['item']['property'][0]['lang']['id']).toBe('EN');
      expect(res.data['directory']['item']['property'][0]['property']['id']).toBe('NAME');
    });
  });

  describe('Directory with value', () => {
    test('Should get with property', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), { id: 'NewYork', directory: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .query(directoryItemQuery, { id: 'CITY' })
        .expectNoErrors();

      expect(res.data['directory']['item']['value']).toHaveLength(1);
      expect(res.data['directory']['item']['value'][0]['id']).toBe('NewYork');
      expect(res.data['directory']['item']['value'][0]['directory']['id']).toBe('CITY');
    });
  });
});
