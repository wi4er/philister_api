import { Test } from '@nestjs/testing';
import { SectionMutationResolver } from './section-mutation.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { gql } from 'apollo-server-express';
import { BlockEntity } from '../../model/block.entity';
import request from 'supertest-graphql';
import { SectionEntity } from '../../model/section.entity';
import { FlagEntity } from '../../../flag/model/flag.entity';
import { Section2flagEntity } from '../../model/section2flag.entity';

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

const updateSectionItemMutation = gql`
  mutation UpdateSection($item: SectionInput!) {
    section {
      update(item: $item) {
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
        flagString
      }
    }
  }
`;

const toggleSectionFlag = gql`
  mutation ToggleFlag($id: Int!, $flag: String!) {
    section {
      toggleFlag(id: $id, flag: $flag) {
        id
        flagString
      }
    }
  }
`;

const deleteSectionMutation = gql`
  mutation DeleteSection($id: [Int!]!) {
    section {
      delete(id: $id)
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
      expect(res.data['section']['add']['parent']).toBeNull();
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

  describe('Section update', () => {
    test('Should update section item', async () => {
      await new BlockEntity().save();
      await new BlockEntity().save();
      await Object.assign(new SectionEntity(), { block: 1 }).save();

      const res = await request(app.getHttpServer())
        .query(updateSectionItemMutation, {
          item: {
            id: 1,
            block: 2,
            property: [],
            flag: [],
          },
        })
        .expectNoErrors();

      expect(res.data['section']['update']['block']['id']).toBe(2);
      expect(res.data['section']['update']['parent']).toBeNull();
    });

    test('Should update with flag', async () => {
      await new BlockEntity().save();
      await Object.assign(new SectionEntity(), { block: 1 }).save();
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .query(updateSectionItemMutation, {
          item: {
            id: 1,
            block: 1,
            property: [],
            flag: [ 'ACTIVE' ],
          },
        })
        .expectNoErrors();

      expect(res.data['section']['update']['flagString']).toEqual([ 'ACTIVE' ]);
    });
  });

  describe('Section flag update', () => {
    test('Should add flag', async () => {
      await new BlockEntity().save();
      await Object.assign(new SectionEntity(), { block: 1 }).save();
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .query(toggleSectionFlag, {
          id: 1,
          flag: 'ACTIVE',
        })
        .expectNoErrors();

      expect(res.data['section']['toggleFlag']['flagString']).toEqual([ 'ACTIVE' ]);
    });

    test('Should remove flag', async () => {
      await new BlockEntity().save();
      const parent = await Object.assign(new SectionEntity(), { block: 1 }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new Section2flagEntity(), { parent, flag }).save();

      const res = await request(app.getHttpServer())
        .query(toggleSectionFlag, {
          id: 1,
          flag: 'ACTIVE',
        })
        .expectNoErrors();

      expect(res.data['section']['toggleFlag']['flagString']).toEqual([]);
    });
  });

  describe('Section deletion', () => {
    test('Should delete section', async () => {
      await new BlockEntity().save();
      await Object.assign(new SectionEntity(), { block: 1 }).save();

      const res = await request(app.getHttpServer())
        .query(deleteSectionMutation, { id: [ 1 ] })
        .expectNoErrors();

      expect(res.data['section']['delete']).toEqual([ 1 ]);
    });
  });
});
