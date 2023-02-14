import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { Block2stringEntity } from './block2string.entity';

describe("Block2flag entity", () => {
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
});