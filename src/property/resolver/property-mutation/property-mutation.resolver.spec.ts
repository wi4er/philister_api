import { Test } from '@nestjs/testing';
import { PropertyMutationResolver } from './property-mutation.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { PropertyEntity } from '../../model/property.entity';
import { Property2stringEntity } from '../../model/property2string.entity';
import { FlagEntity } from '../../../flag/model/flag.entity';

const propertyAddMutation = gql`
  mutation addProperty($item: PropertyInput!) {
    property {
      add(item: $item) {
        id
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

const propertyUpdateMutation = gql`
  mutation addProperty($item: PropertyInput!) {
    property {
      update(item: $item) {
        id
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

const propertyDeleteMutation = gql`
  mutation addProperty($id: [String!]!) {
    property {
      delete(id: $id)
    }
  }
`;

describe('PropertyMutationResolver', () => {
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

  describe('Property addition', () => {
    test('Should add item ', async () => {
      const res = await request(app.getHttpServer())
        .mutate(propertyAddMutation, {
          item: {
            id: 'NAME',
            flag: [],
            property: [],
          },
        })
        .expectNoErrors();

      expect(res.data['property']['add']['id']).toBe('NAME');
    });

    test('Should add item with property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'PROP' }).save();
      const res = await request(app.getHttpServer())
        .mutate(propertyAddMutation, {
          item: {
            id: 'NAME',
            flag: [],
            property: [ {
              property: 'PROP',
              string: 'VALUE',
            } ],
          },
        })
        .expectNoErrors();

      expect(res.data['property']['add']['id']).toBe('NAME');
      expect(res.data['property']['add']['propertyList']).toHaveLength(1);
      expect(res.data['property']['add']['propertyList'][0]['property']['id']).toBe('PROP');
      expect(res.data['property']['add']['propertyList'][0]['string']).toBe('VALUE');
    });

    test('Should add item with flag', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      const res = await request(app.getHttpServer())
        .mutate(propertyAddMutation, {
          item: {
            id: 'NAME',
            flag: [ 'ACTIVE' ],
            property: [],
          },
        })
        .expectNoErrors();

      expect(res.data['property']['add']['flagString']).toEqual([ 'ACTIVE' ]);
    });
  });

  describe('Property updating', () => {
    test('Should update property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'PROP' }).save();
      const res = await request(app.getHttpServer())
        .mutate(propertyUpdateMutation, {
          item: {
            id: 'PROP',
            flag: [],
            property: [ {
              string: 'VALUE',
              property: 'PROP',
            } ],
          },
        })
        .expectNoErrors();

      expect(res.data['property']['update']['id']).toBe('PROP');
      expect(res.data['property']['update']['propertyList']).toHaveLength(1);
    });

    test('Should update property with properties', async () => {
      await Object.assign(new PropertyEntity(), { id: 'PROP' }).save();
      await Object.assign(new PropertyEntity(), { id: 'UPDATE' }).save();
      await Object.assign(
        new Property2stringEntity(),
        { string: 'VALUE', property: 'PROP', parent: 'UPDATE' },
      ).save();

      const res = await request(app.getHttpServer())
        .mutate(propertyUpdateMutation, {
          item: {
            id: 'UPDATE',
            flag: [],
            property: [ {
              string: 'NEW',
              property: 'PROP',
            } ],
          },
        })
        .expectNoErrors();

      expect(res.data['property']['update']['id']).toBe('UPDATE');
      expect(res.data['property']['update']['propertyList']).toHaveLength(1);
      expect(res.data['property']['update']['propertyList'][0]['string']).toBe('NEW');
      expect(res.data['property']['update']['propertyList'][0]['property']['id']).toBe('PROP');
    });

    test('Should remove properties from properties', async () => {
      await Object.assign(new PropertyEntity(), { id: 'PROP' }).save();
      await Object.assign(new PropertyEntity(), { id: 'UPDATE' }).save();
      await Object.assign(
        new Property2stringEntity(),
        { string: 'VALUE', property: 'PROP', parent: 'UPDATE' },
      ).save();

      const res = await request(app.getHttpServer())
        .mutate(propertyUpdateMutation, {
          item: {
            id: 'UPDATE',
            flag: [],
            property: [],
          },
        })
        .expectNoErrors();

      expect(res.data['property']['update']['id']).toBe('UPDATE');
      expect(res.data['property']['update']['propertyList']).toHaveLength(0);
    });
  });

  describe('Property deletion', () => {
    test('Should delete property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'PROP' }).save();
      const res = await request(app.getHttpServer())
        .mutate(propertyDeleteMutation, { id: 'PROP' })
        .expectNoErrors();

      expect(res.data['property']['delete']).toEqual([ 'PROP' ]);
    });

    test('Should delete property list', async () => {
      for (let i = 1; i <= 10; i++) {
        await Object.assign(new PropertyEntity(), { id: `PROP_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .mutate(propertyDeleteMutation, {
          id: [ 'PROP_1', 'PROP_3', 'PROP_5' ],
        })
        .expectNoErrors();

      expect(res.data['property']['delete']).toEqual([ 'PROP_1', 'PROP_3', 'PROP_5' ]);
    });
  });
});
