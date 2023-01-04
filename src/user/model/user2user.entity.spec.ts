import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { PropertyEntity } from '../../property/model/property.entity';
import { UserEntity } from './user.entity';
import { User2userEntity } from "./user2user.entity";

describe('User user entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User with user property', () => {
    test('Should create user with user', async () => {
      const repo = source.getRepository(UserEntity);

      await Object.assign(new PropertyEntity(), { id: 'PARENT' }).save();
      const child = await Object.assign(new UserEntity(), { login: 'child' }).save();
      const parent = await Object.assign(new UserEntity(), { login: 'PARENT' }).save();

      await Object.assign(new User2userEntity(), {user: child, property: 'PARENT', parent: 1 }).save()

      const inst = await repo.findOne({ where: { id: 1 }, relations: { child: true } });

      expect(inst.child).toHaveLength(1);
    });

    test('Shouldn`t create user with wrong relation', async () => {
      const user = new User2userEntity();

      await expect(user.save()).rejects.toThrow();
    });
  });
});