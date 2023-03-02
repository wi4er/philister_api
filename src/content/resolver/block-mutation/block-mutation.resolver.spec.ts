import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { PropertyEntity } from '../../../property/model/property.entity';
import { FlagEntity } from '../../../flag/model/flag.entity';
import { BlockEntity } from '../../model/block.entity';
import { Block2flagEntity } from '../../model/block2flag.entity';

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

const updateBlockItemMutation = gql`
  mutation addBlockItem($item: BlockInput!) {
    block {
      update(item: $item) {
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

const toggleBlockFlagMutation = gql`
  mutation toggleFlag($id: Int!, $flag: String!) {
    block {
      toggleFlag(id: $id, flag: $flag) {
        id
        flagString
      }
    }
  }
`;

const deleteBlockMutation = gql`
  mutation deleteBlock($id: [Int!]!) {
    block {
      delete(id: $id)
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
          item: { flag: [], property: [ { property: 'NAME', string: 'VALUE' } ] },
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

  describe('Block update', () => {
    test('Should update block', async () => {
      await new BlockEntity().save();

      const res = await request(app.getHttpServer())
        .mutate(updateBlockItemMutation, {
          item: { flag: [], property: [] },
        })
        .expectNoErrors();

      // console.log(res.data);
    });

    test('Should update with property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await new BlockEntity().save();

      const res = await request(app.getHttpServer())
        .mutate(updateBlockItemMutation, {
          item: {
            flag: [], property: [ {
              property: 'NAME',
              string: 'VALUE',
            } ],
          },
        })
        .expectNoErrors();

      expect(res.data['block']['update']['propertyList']).toHaveLength(1);
      expect(res.data['block']['update']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['block']['update']['propertyList'][0]['property']['id']).toBe('NAME');
    });

    test('Should update with flag', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await new BlockEntity().save();

      const res = await request(app.getHttpServer())
        .mutate(updateBlockItemMutation, {
          item: {
            flag: [ 'ACTIVE' ], property: [],
          },
        })
        .expectNoErrors();

      expect(res.data['block']['update']['flagString']).toEqual([ 'ACTIVE' ]);
    });
  });

  describe('Block flag toggle', () => {
    test('Should add flag', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await new BlockEntity().save();

      const res = await request(app.getHttpServer())
        .mutate(toggleBlockFlagMutation, {
          id: 1,
          flag: 'ACTIVE',
        })
        .expectNoErrors();

      expect(res.data['block']['toggleFlag']['flagString']).toEqual([ 'ACTIVE' ]);
    });

    test('Should remove flag', async () => {
      const parent = await new BlockEntity().save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new Block2flagEntity(), { parent, flag }).save();

      const res = await request(app.getHttpServer())
        .mutate(toggleBlockFlagMutation, {
          id: 1,
          flag: 'ACTIVE',
        })
        .expectNoErrors();

      expect(res.data['block']['toggleFlag']['flagString']).toEqual([]);
    });
  });

  describe('Block deletion', () => {
    test('Should delete block', async () => {
      const block = await new BlockEntity().save();

      const res = await request(app.getHttpServer())
        .mutate(deleteBlockMutation, { id: block.id })
        .expectNoErrors();

      expect(res.data['block']['delete']).toEqual([ 1 ]);
    });

    test('Should delete with wrong id', async () => {
      await new BlockEntity().save();
      await new BlockEntity().save();

      const res = await request(app.getHttpServer())
        .mutate(deleteBlockMutation, { id: [ 1, 2, 3 ] })
        .expectNoErrors();

      expect(res.data['block']['delete']).toEqual([ 1, 2 ]);
    });
  });
});