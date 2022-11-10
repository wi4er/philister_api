import { Test, TestingModule } from '@nestjs/testing';
import { PropertyMutationResolver } from './property-mutation.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../model/property.entity";

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
      await Object.assign(new PropertyEntity(), { id: 'PROP' }).save();
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
});
