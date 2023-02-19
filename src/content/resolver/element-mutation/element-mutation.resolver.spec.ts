import { Test } from '@nestjs/testing';
import { ElementMutationResolver } from './element-mutation.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { BlockEntity } from '../../model/block.entity';
import { FlagEntity } from '../../../flag/model/flag.entity';
import { PropertyEntity } from '../../../property/model/property.entity';

const addElementMutation = gql`
  mutation AddElementMutation($item: ElementInput!) {
    element {
      add(item: $item) {
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

describe('ElementMutationResolver', () => {
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

  describe('Element addition', () => {
    test('Should add element', async () => {
      await new BlockEntity().save();

      const res = await request(app.getHttpServer())
        .query(addElementMutation, { item: { block: 1, property: [], flag: [] } })
        .expectNoErrors();

      expect(res.data['element']['add']['id']).toBe(1);
      expect(res.data['element']['add']['block']['id']).toBe(1);
    });

    test('Should add with flags', async () => {
      await new BlockEntity().save();
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .query(addElementMutation, { item: { block: 1, property: [], flag: [ 'ACTIVE' ] } })
        .expectNoErrors();

      expect(res.data['element']['add']['flagString']).toEqual([ 'ACTIVE' ]);
    });

    test('Should add with strings', async () => {
      await new BlockEntity().save();
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .query(addElementMutation, {
          item: {
            block: 1,
            property: [ { property: 'NAME', string: 'VALUE' } ],
            flag: [],
          },
        })
        .expectNoErrors();

      expect(res.data['element']['add']['propertyList']).toHaveLength(1);
      expect(res.data['element']['add']['propertyList'][0]['property']['id']).toBe('NAME');
      expect(res.data['element']['add']['propertyList'][0]['string']).toBe('VALUE');
    });
  });
});
