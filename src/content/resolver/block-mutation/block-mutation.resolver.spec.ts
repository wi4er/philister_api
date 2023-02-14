import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { PropertyEntity } from '../../../property/model/property.entity';
import { FlagEntity } from '../../../flag/model/flag.entity';

const addBlockItemMutation = gql`
  mutation addBlockItem($item: BlockInput!) {
    block {
      add(item: $item) {
        id
        created_at
        updated_at
        version
        propertyList {
          id
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

describe('BlockMutationResolver', () => {
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

  describe('Block addition', () => {
    test('Should add blank item ', async () => {
      const res = await request(app.getHttpServer())
        .mutate(addBlockItemMutation, {
          item: { flag: [], property: [] },
        })
        .expectNoErrors();

      expect(res.data['block']['add']['id']).toBe(1);
    });

    test('Should add item with property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addBlockItemMutation, {
          item: {
            flag: [], property: [ { property: 'NAME', string: 'VALUE' } ],
          },
        })
        .expectNoErrors();

      expect(res.data['block']['add']['propertyList']).toHaveLength(1);
      expect(res.data['block']['add']['propertyList'][0]['property']['id']).toBe('NAME');
      expect(res.data['block']['add']['propertyList'][0]['string']).toBe('VALUE');
    });

    test('Should add item with flag', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addBlockItemMutation, {
          item: {
            flag: [ 'ACTIVE' ], property: [],
          },
        })
        .expectNoErrors();

      expect(res.data['block']['add']['flagString']).toEqual([ 'ACTIVE' ]);
    });
  });
});