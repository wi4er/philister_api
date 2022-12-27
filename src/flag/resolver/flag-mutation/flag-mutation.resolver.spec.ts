import { Test } from '@nestjs/testing';
import { FlagMutationResolver } from './flag-mutation.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../../property/model/property.entity";

const FlagAddMutation = gql`
  mutation AddFlag($item: FlagInput!) {
    flag {
      add(item: $item) {
        id
        label
        flagList {
          id
          flag {
            id
          }
        }
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
`

describe('FlagMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Flag addition', () => {
    test('Should add flag', async () => {
      const res = await request(app.getHttpServer())
        .mutate(FlagAddMutation, {
          item: {
            id: 'ACTIVE',
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['flag']['add']['id']).toBe('ACTIVE');
    });

    test('Should add flag with property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .mutate(FlagAddMutation, {
          item: {
            id: 'ACTIVE',
            property: [ {
              property: 'NAME',
              string: 'VALUE'
            } ],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['flag']['add']['id']).toBe('ACTIVE');
      expect(res.data['flag']['add']['propertyList']).toHaveLength(1);
      expect(res.data['flag']['add']['propertyList'][0]['string']).toBe('VALUE');
    });
  });
});
