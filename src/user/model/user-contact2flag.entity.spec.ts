import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserContact2flagEntity } from "./user-contact2flag.entity";
import { UserContactEntity, UserContactType } from "./user-contact.entity";
import { FlagEntity } from "../../flag/model/flag.entity";

describe('UserContact 2 flag entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('UserContact2flag fields', () => {
    test('Should create user contact flag', async () => {
      const parent = await Object.assign(new UserContactEntity(), {
        id: 'EMAIL',
        type: UserContactType.EMAIL,
      }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const inst = new UserContact2flagEntity();
      inst.parent = parent;
      inst.flag = flag;

      await inst.save();

      expect(inst.created_at).toBeDefined();
      expect(inst.updated_at).toBeDefined();
      expect(inst.deleted_at).toBeNull();
      expect(inst.version).toBe(1);
    });

    test('Shouldn`t create without flag', async () => {
      const parent = await Object.assign(new UserContactEntity(), {
        id: 'EMAIL',
        type: UserContactType.EMAIL,
      }).save();

      const inst = new UserContact2flagEntity();
      inst.parent = parent;

      await expect(inst.save()).rejects.toThrow('flagId');
    });

    test('Shouldn`t create without parent', async () => {
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const inst = new UserContact2flagEntity();
      inst.flag = flag;

      await expect(inst.save()).rejects.toThrow('parentId');
    });
  });

  describe('User contact with flag', () => {
    test('Should create user contact with flag', async () => {
      const repo = source.getRepository(UserContactEntity);

      const parent = await Object.assign(new UserContactEntity(), {
        id: 'EMAIL',
        type: UserContactType.EMAIL,
      }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new UserContact2flagEntity(), { parent, flag }).save();

      const inst = await repo.findOne({ where: { id: 'EMAIL' }, relations: { flag: { flag: true } } });

      expect(inst.flag).toHaveLength(1);
      expect(inst.flag[0].id).toBe(1);
      expect(inst.flag[0].flag.id).toBe('ACTIVE');
    });
  });
});