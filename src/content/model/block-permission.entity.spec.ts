import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { BlockPermissionEntity } from './block-permission.entity';

describe('Block permission entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Block permission fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(BlockPermissionEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });
});