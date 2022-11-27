import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { ChangeLogEntity } from './change-log.entity';
import { UserEntity } from "../../user/model/user.entity";

describe('ChangeLog entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('ChangeLog fields', () => {
    test('Should create item', async () => {
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();
      const inst = new ChangeLogEntity();
      inst.entity = 'content';
      inst.entityId = '10';
      inst.field = 'property_NAME';
      inst.value = 'new';
      inst.user = user;
      await inst.save();

      expect(inst.id).toBe(1);
      expect(inst.entity).toBe('content');
      expect(inst.field).toBe('property_NAME');
      expect(inst.value).toBe('new');
      expect(inst.created_at).not.toBeUndefined();
    });
  });
});