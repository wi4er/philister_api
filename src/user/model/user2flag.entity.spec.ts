import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserEntity } from "./user.entity";
import { FlagEntity } from "../../flag/model/flag.entity";
import { User2flagEntity } from "./user2flag.entity";

describe('User2flag entity', () => {

  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User2flag fields', () => {
    test('Should create user flag', async () => {
      const parent = await Object.assign(new UserEntity(), { login: 'user' }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const inst = new User2flagEntity();
      inst.parent = parent;
      inst.flag = flag;

      await inst.save();

      expect(inst.created_at).toBeDefined();
      expect(inst.updated_at).toBeDefined();
      expect(inst.deleted_at).toBeNull();
      expect(inst.version).toBe(1);
    });

    test('Shouldn`t create without flag', async () => {
      const parent = await Object.assign(new UserEntity(), { login: 'user' }).save();

      const inst = new User2flagEntity();
      inst.parent = parent;

      await expect(inst.save()).rejects.toThrow('flagId');
    });

    test('Shouldn`t create without parent', async () => {
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const inst = new User2flagEntity();
      inst.flag = flag;

      await expect(inst.save()).rejects.toThrow('parentId');
    });
  });

  describe("User with flags", () => {
    test('Should add item', async () => {
      const repo = source.getRepository(UserEntity);
      const flag = await Object.assign(new FlagEntity(), { id: 'DATA' }).save();
      const parent = await Object.assign(new UserEntity(), { login: 'USER' }).save();

      await Object.assign(new User2flagEntity(), { flag, parent }).save()

      const list = await repo.find({ relations: { flag: { flag: true } } });

      expect(list).toHaveLength(1);
      expect(list[0].flag).toHaveLength(1);
      expect(list[0].flag[0].id).toBe(1);
      expect(list[0].flag[0].flag.id).toBe('DATA');
    });

    test('Shouldn`t create with duplicate flag', async () => {
      const flag = await Object.assign(new FlagEntity(), { id: 'DATA' }).save();
      const parent = await Object.assign(new UserEntity(), { login: 'USER' }).save();

      await Object.assign(new User2flagEntity(), { flag, parent }).save()
      await expect(
        Object.assign(new User2flagEntity(), { flag, parent }).save()
      ).rejects.toThrow('duplicate key');
    });
  });
});