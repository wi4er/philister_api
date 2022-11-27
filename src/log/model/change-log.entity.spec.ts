import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { ChangeLogEntity } from './change-log.entity';

describe('ChangeLog entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('ChangeLog fields', () => {
    test('Should create item', async () => {
      const inst = new ChangeLogEntity();
      inst.entity = 'content';
      inst.field = 'property_NAME';
      inst.value = 'new';
      await inst.save();

      expect(inst.id).toBe(1);
      expect(inst.entity).toBe('content');
      expect(inst.field).toBe('property_NAME');
      expect(inst.value).toBe('new');
      expect(inst.created_at).not.toBeUndefined();
    });
  });
});