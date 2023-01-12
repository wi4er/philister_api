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

      await Object.assign(new User2userEntity(), {
        user: child,
        property: 'PARENT',
        parent,
      }).save()

      const inst = await repo.findOne({
        where: { id: parent.id },
        relations: { child: true },
      });

      expect(inst.child).toHaveLength(1);
      expect(inst.child[0].id).toBe(1);
    });

    test('Shouldn`t create user without parent', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'PARENT' }).save();
      const user = await Object.assign(new UserEntity(), { login: 'child' }).save();

      const inst = await Object.assign(new User2userEntity(), {
        user,
        property,
      });

      await expect(inst.save()).rejects.toThrow('parentId');
    });

    test('Shouldn`t create user without property', async () => {
      const user = await Object.assign(new UserEntity(), { login: 'child' }).save();
      const parent = await Object.assign(new UserEntity(), { login: 'PARENT' }).save();

      const inst = await Object.assign(new User2userEntity(), {
        user,
        parent,
      });

      await expect(inst.save()).rejects.toThrow('propertyId');
    });

    test('Shouldn`t create user without user', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'PARENT' }).save();
      const parent = await Object.assign(new UserEntity(), { login: 'PARENT' }).save();

      const inst = await Object.assign(new User2userEntity(), {
        parent,
        property,
      });

      await expect(inst.save()).rejects.toThrow('userId');
    });

    test('Shouldn`t create user duplicate user', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'PARENT' }).save();
      const user = await Object.assign(new UserEntity(), { login: 'child' }).save();
      const parent = await Object.assign(new UserEntity(), { login: 'PARENT' }).save();

      await Object.assign(new User2userEntity(), { user, property, parent }).save()

      await expect(
        Object.assign(new User2userEntity(), { user, property, parent }).save()
      ).rejects.toThrow('duplicate key value violates unique constraint');
    });
  });
});