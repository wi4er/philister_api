import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserEntity } from "./user.entity";
import { ValueEntity } from "../../directory/model/value.entity";
import { DirectoryEntity } from "../../directory/model/directory.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { User2valueEntity } from "./user2value.entity";

describe('User entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe("User values", () => {
    test('Should create user with value', async () => {
      const repo = source.getRepository(UserEntity);

      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), { id: 'LONDON', directory: 'CITY' }).save();
      await Object.assign(new PropertyEntity(), { id: 'CURRENT_CITY' }).save();
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();

      await Object.assign(new User2valueEntity(), { property: 'CURRENT_CITY', value: 'LONDON', parent: 1 }).save();

      const inst = await repo.findOne({ where: { id: user.id }, relations: { value: { value: { directory: true } } } });

      expect(inst.value[0].value.id).toBe('LONDON');
      expect(inst.value[0].value.directory.id).toBe('CITY');
    });

    test('Should create user with multi value', async () => {
      const repo = source.getRepository(UserEntity);

      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      for (let i = 0; i < 10; i++) {
        await Object.assign(new ValueEntity(), { id: `LONDON_${i}`, directory: 'CITY' }).save();
      }
      await Object.assign(new PropertyEntity(), { id: 'CURRENT_CITY' }).save();
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();

      await Object.assign(new User2valueEntity(), { property: 'CURRENT_CITY', value: 'LONDON_0', parent: 1 }).save();
      await Object.assign(new User2valueEntity(), { property: 'CURRENT_CITY', value: 'LONDON_3', parent: 1 }).save();
      await Object.assign(new User2valueEntity(), { property: 'CURRENT_CITY', value: 'LONDON_6', parent: 1 }).save();

      const inst = await repo.findOne({ where: { id: user.id }, relations: { value: true } });

      expect(inst.value).toHaveLength(3);
    });

    test('Shouldn`t create user with same value and property', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), { id: 'LONDON', directory: 'CITY' }).save();
      await Object.assign(new PropertyEntity(), { id: 'CURRENT_CITY' }).save();
      await Object.assign(new UserEntity(), { login: 'user' }).save();

      await Object.assign(new User2valueEntity(), { property: 'CURRENT_CITY', value: 'LONDON', parent: 1 }).save();
      const wrong = await Object.assign(new User2valueEntity(), {
        property: 'CURRENT_CITY',
        value: 'LONDON',
        parent: 1
      });

      await expect(wrong.save()).rejects.toThrow('duplicate key value violates unique constraint');
    });
  });
});