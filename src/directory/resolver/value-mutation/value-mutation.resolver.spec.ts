import { Test } from '@nestjs/testing';
import { ValueMutationResolver } from './value-mutation.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { DirectoryEntity } from '../../model/directory.entity';
import { ValueEntity } from '../../model/value.entity';
import { PropertyEntity } from '../../../property/model/property.entity';
import { FlagEntity } from '../../../flag/model/flag.entity';

const addValueMutation = gql`
  mutation AddValue($item: ValueInput!) {
    value {
      add(item: $item) {
        id
        directory {
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

const updateValueMutation = gql`
  mutation AddValue($item: ValueInput!) {
    value {
      update(item: $item) {
        id
        directory {
          id
        }
      }
    }
  }
`;

const deleteValueMutation = gql`
  mutation deleteValue($id: [String!]!){
    value {
      delete(id: $id)
    }
  }
`;

describe('ValueMutationResolver', () => {
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

  describe('Value addition', () => {
    test('Should add value', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addValueMutation, {
          item: {
            id: 'London',
            directory: 'CITY',
            property: [],
            flag: [],
          },
        })
        .expectNoErrors();

      expect(res.data['value']['add']['id']).toBe('London');
    });

    test('Should add with property', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addValueMutation, {
          item: {
            id: 'London',
            directory: 'CITY',
            property: [ {
              property: 'NAME',
              string: 'VALUE',
            } ],
            flag: [],
          },
        })
        .expectNoErrors();

      expect(res.data['value']['add']['id']).toBe('London');
      expect(res.data['value']['add']['propertyList']).toHaveLength(1);
      expect(res.data['value']['add']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['value']['add']['propertyList'][0]['property']['id']).toBe('NAME');
    });

    test('Should add with flag', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addValueMutation, {
          item: {
            id: 'London',
            directory: 'CITY',
            property: [],
            flag: [ 'ACTIVE' ],
          },
        })
        .expectNoErrors();

      expect(res.data['value']['add']['id']).toBe('London');
      expect(res.data['value']['add']['flagString']).toEqual([ 'ACTIVE' ]);
    });

    test('Shouldn\'t add with wrong directory', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addValueMutation, {
          item: {
            id: 'London',
            directory: 'WRONG',
            flag: [],
            property: [],
          },
        });

      expect(res.errors[0].path).toEqual([ 'value', 'add' ]);
    });

    test('Shouldn\'t add without directory', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addValueMutation, { item: { id: 'London' } });

      expect(res.errors[0].extensions).toEqual({ code: 'BAD_USER_INPUT' });
    });
  });

  describe('Value update', () => {
    test('Should update value', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new DirectoryEntity(), { id: 'VILLAGE' }).save();

      await Object.assign(new ValueEntity(), { id: 'London', directory: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateValueMutation, {
          item: {
            id: 'London',
            directory: 'VILLAGE',
            flag: [],
            property: [],
          },
        })
        .expectNoErrors();

      expect(res.data['value']['update']['id']).toBe('London');
      expect(res.data['value']['update']['directory']['id']).toBe('VILLAGE');
    });
  });

  describe('Value deletion', () => {
    test('Should delete item', async () => {
      const directory = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), { id: 'London', directory }).save();

      const res = await request(app.getHttpServer())
        .mutate(deleteValueMutation, { id: 'London' })
        .expectNoErrors();

      expect(res.data['value']['delete']).toEqual([ 'London' ]);
    });

    test('Should delete list', async () => {
      const directory = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      for (let i = 0; i < 10; i++) {
        await Object.assign(new ValueEntity(), { id: `London_${i}`, directory }).save();
      }

      const res = await request(app.getHttpServer())
        .mutate(deleteValueMutation, { id: [ 'London_0', 'London_3', 'London_5' ] })
        .expectNoErrors();

      expect(res.data['value']['delete']).toEqual([ 'London_0', 'London_3', 'London_5' ]);
    });
  });
});
