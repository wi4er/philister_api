import { Test } from '@nestjs/testing';
import { SectionMutationResolver } from './section-mutation.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { gql } from 'apollo-server-express';
import { BlockEntity } from '../../model/block.entity';
import request from 'supertest-graphql';
import { SectionEntity } from '../../model/section.entity';

const addSectionItemMutation = gql`
  mutation AddSection($item: SectionInput!) {
    section {
      add(item: $item) {
        id
        block {
          id
        }
        parent {
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

describe('SectionMutationResolver', () => {
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

  describe('Section addition', () => {
    test('Should add item', async () => {
      await new BlockEntity().save();

      const res = await request(app.getHttpServer())
        .query(addSectionItemMutation, { item: { block: 1, property: [], flag: [] } })
        .expectNoErrors();

      expect(res.data['section']['add']['id']).toBe(1);
      expect(res.data['section']['add']['block']['id']).toBe(1);
    });

    test('Should add with parent', async () => {
      await new BlockEntity().save();
      await Object.assign(new SectionEntity(), { block: 1 }).save();

      const res = await request(app.getHttpServer())
        .query(addSectionItemMutation, {
          item: {
            block: 1,
            parent: 1,
            property: [],
            flag: [],
          },
        })
        .expectNoErrors();

      expect(res.data['section']['add']['id']).toBe(2);
      expect(res.data['section']['add']['parent']['id']).toBe(1);
    });
  });
});
