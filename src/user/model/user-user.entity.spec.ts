import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { PropertyEntity } from '../../property/model/property.entity';
import { UserEntity } from './user.entity';
import { UserUserEntity } from "./user-user.entity";

describe('User user entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User with user property', () => {
    test('Should create user with user', async () => {
      await Object.assign(new PropertyEntity(), { id: 'PARENT' }).save();
      const child = await Object.assign(new UserEntity(), { login: 'child' }).save();

      const user = await Object.assign(
        new UserEntity(), {
          login: 'PARENT',
          child: [
            await Object.assign(new UserUserEntity(), {user: child, property: 'PARENT'}).save()
          ]
        }
      ).save();

      console.log(user);

      expect(user.child).toHaveLength(1);
    });

    test('Shouldn`t create user with wrong relation', async () => {
      const user = new UserUserEntity();

      await expect(user.save()).rejects.toThrow();
    });
  });
});