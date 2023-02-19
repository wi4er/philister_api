import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { ElementEntity } from './element.entity';
import { BlockEntity } from './block.entity';

describe('Element entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Element fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(ElementEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should get list', async () => {
      await new BlockEntity().save();
      await Object.assign(new ElementEntity(), { block: 1 }).save();

      const repo = source.getRepository(ElementEntity);
      const list = await repo.find();

      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(1);
    });
  });
});