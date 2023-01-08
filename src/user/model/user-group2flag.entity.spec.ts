import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { FlagEntity } from "../../flag/model/flag.entity";
import { UserGroupEntity } from "./user-group.entity";
import { UserGroup2flagEntity } from "./user-group2flag.entity";

describe('UserGroup 2 flag entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('UserGroup2flag fields', () => {
    test('Should create user contact flag', async () => {
      const parent = await new UserGroupEntity().save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const inst = new UserGroup2flagEntity();
      inst.parent = parent;
      inst.flag = flag;

      await inst.save();

      expect(inst.created_at).toBeDefined();
      expect(inst.updated_at).toBeDefined();
      expect(inst.deleted_at).toBeNull();
      expect(inst.version).toBe(1);
    });

    test('Shouldn`t create without flag', async () => {
      const parent = await new UserGroupEntity().save();
      const inst = new UserGroup2flagEntity();
      inst.parent = parent;

      await expect(inst.save()).rejects.toThrow('flagId');
    });

    test('Shouldn`t create without parent', async () => {
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const inst = new UserGroup2flagEntity();
      inst.flag = flag;

      await expect(inst.save()).rejects.toThrow('parentId');
    });
  });

  describe('User group with flag', () => {
    test('Should create user contact with flag', async () => {
      const repo = source.getRepository(UserGroupEntity);

      const parent = await new UserGroupEntity().save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new UserGroup2flagEntity(), { parent, flag }).save();

      const inst = await repo.findOne({ where: { id: 1 }, relations: { flag: { flag: true } } });

      expect(inst.flag).toHaveLength(1);
      expect(inst.flag[0].id).toBe(1);
      expect(inst.flag[0].flag.id).toBe('ACTIVE');
    });
  });
});