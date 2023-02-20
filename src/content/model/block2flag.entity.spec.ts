import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { Block2stringEntity } from './block2string.entity';
import { BlockEntity } from './block.entity';
import { FlagEntity } from '../../flag/model/flag.entity';
import { Block2flagEntity } from './block2flag.entity';

describe('Block2flag entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Block2flag fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(Block2stringEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });

  describe('Block with flags', () => {
    test('Shouldn`t have duplicate flag', async () => {
      const parent = await new BlockEntity().save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new Block2flagEntity(), { flag, parent }).save();
      await expect(
        Object.assign(new Block2flagEntity(), { flag, parent }).save(),
      ).rejects.toThrow();
    });
  });
});