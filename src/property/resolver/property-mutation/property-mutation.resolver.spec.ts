import { Test } from '@nestjs/testing';
import { PropertyMutationResolver } from './property-mutation.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../model/property.entity";
import { PropertyPropertyEntity } from "../../model/property-property.entity";

const propertyAddMutation = gql`
  mutation addProperty($item: PropertyInput!) {
    property {
      add(item: $item) {
        id
        property {
          value
          property {
            id
          }
        }
      }
    }
  }
`;

const propertyUpdateMutation = gql`
  mutation addProperty($item: PropertyInput!) {
    property {
      update(item: $item) {
        id
        property {
          value
          property {
            id
          }
        }
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
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Property addition', () => {
    it('should be defined', () => {

    });

    test("Should add item ", async () => {
      const res = await request(app.getHttpServer())
        .mutate(propertyAddMutation, {
          item: { id: 'NAME' }
        })
        .expectNoErrors();

      expect(res.data['property']['add']['id']).toBe('NAME');
    });

    test("Should add item with property", async () => {
      await Object.assign(new PropertyEntity(), { id: 'PROP' }).save();
      const res = await request(app.getHttpServer())
        .mutate(propertyAddMutation, {
          item: {
            id: 'NAME',
            property: [ {
              property: 'PROP',
              value: 'VALUE',
            } ]
          }
        })
        .expectNoErrors();

      expect(res.data['property']['add']['id']).toBe('NAME');
      expect(res.data['property']['add']['property'][0]['property']['id']).toBe('PROP');
      expect(res.data['property']['add']['property'][0]['value']).toBe('VALUE');
    });
  });

  describe('Property updating', () => {
    test("Should update property", async () => {
      await Object.assign(new PropertyEntity(), { id: 'PROP' }).save();
      const res = await request(app.getHttpServer())
        .mutate(propertyUpdateMutation, {
          item: {
            id: 'PROP',
            property: [ {
              value: 'VALUE',
              property: 'PROP'
            } ]
          }
        })
        .expectNoErrors();

      expect(res.data['property']['update']['id']).toBe('PROP');
      expect(res.data['property']['update']['property']).toHaveLength(1);
    });

    test("Should update property with properties", async () => {
      await Object.assign(new PropertyEntity(), { id: 'PROP' }).save();

      await Object.assign(new PropertyEntity(), {
        id: 'UPDATE',
        property: [
          await Object.assign(new PropertyPropertyEntity(), { value: 'VALUE', property: 'PROP' }).save(),
        ]
      }).save();

      const res = await request(app.getHttpServer())
        .mutate(propertyUpdateMutation, {
          item: {
            id: 'UPDATE',
            property: [ {
              value: 'NEW',
              property: 'PROP'
            } ]
          }
        })
        .expectNoErrors();

      expect(res.data['property']['update']['id']).toBe('UPDATE');
      expect(res.data['property']['update']['property']).toHaveLength(1);
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
          id: [ 'PROP_1', 'PROP_3', 'PROP_5' ]
        })
        .expectNoErrors();

      expect(res.data['property']['delete']).toEqual([ 'PROP_1', 'PROP_3', 'PROP_5' ]);
    });
  });
});
