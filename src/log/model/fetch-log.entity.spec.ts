import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { FetchLogEntity } from './fetch-log.entity';
import { UserEntity } from "../../user/model/user.entity";

describe('FetchLog entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('FetchLog fields', () => {
    test('Should create item', async () => {
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();

      const inst = new FetchLogEntity();
      inst.entity = 'element';
      inst.operation = 'list';
      inst.arguments = '{}';
      inst.user = user;
      await inst.save();

      expect(inst.id).toBe(1);
      expect(inst.entity).toBe('element');
      expect(inst.operation).toBe('list');
      expect(inst.arguments).toBe('{}');
      expect(inst.created_at).not.toBeUndefined();
    });
  });
});