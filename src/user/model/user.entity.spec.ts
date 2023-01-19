import { UserEntity } from './user.entity';
import { createConnection } from 'typeorm';
import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnectionOptions } from '../../createConnectionOptions';

describe('User entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User fields', () => {
    test('Should find empty list', async () => {
      const repo = source.getRepository(UserEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should add item', async () => {
      const user = await Object.assign(new UserEntity(), {
        login: 'TEST',
        hash: 'CRYPT',
      }).save();

      expect(user.created_at).toBeDefined();
      expect(user.updated_at).toBeDefined();
      expect(user.deleted_at).toBeNull();
      expect(user.login).toBe('TEST');
      expect(user.hash).toBe('CRYPT');
    });

    test('Should update item', async () => {
      const repo = source.getRepository(UserEntity);
      await Object.assign(new UserEntity(), { login: 'TEST' }).save();

      const user = await repo.findOne({ where: { login: 'TEST' } });
      user.login = 'updated';
      await user.save();

      const updated = await repo.findOne({ where: { id: user.id } });
      expect(updated.login).toBe('updated');
    });

    test('Should find item', async () => {
      const repo = source.getRepository(UserEntity);

      await Object.assign(new UserEntity(), { login: 'TEST' }).save();
      const list = await repo.find();

      expect(list).toHaveLength(1);
      expect(list[0].login).toBe('TEST');
    });

    test('Should`t create with same login', async () => {
      await Object.assign(new UserEntity(), { login: 'TEST' }).save();

      const user = Object.assign(new UserEntity(), { login: 'TEST' });

      await expect(user.save()).rejects.toThrow(
        'duplicate key value violates unique constraint',
      );
    });
  });
});
