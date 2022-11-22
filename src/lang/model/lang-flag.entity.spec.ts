import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { LangEntity } from "./lang.entity";
import { FlagEntity } from "../../flag/model/flag.entity";
import { LangFlagEntity } from "./lang-flag.entity";

describe("LangFlag entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('LangFlag fields', () => {
    test('Should add item', async () => {
      const flag = await Object.assign(new FlagEntity(), { id: 'NAME', label: 'name' }).save();
      const parent = await Object.assign(new LangEntity(), { id: 'UA' }).save();

      const inst = new LangFlagEntity();
      inst.flag = flag;
      inst.parent = parent;
      await inst.save();

      expect(inst.created_at).toBeDefined();
      expect(inst.updated_at).toBeDefined();
      expect(inst.deleted_at).toBeNull();
      expect(inst.version).toBe(1);
    });

    test('Shouldn`t ad with same flag and parent', async () => {
      const flag = await Object.assign(new FlagEntity(), { id: 'NAME', label: 'name' }).save();
      const parent = await Object.assign(new LangEntity(), { id: 'UA' }).save();

      const inst = new LangFlagEntity();
      inst.flag = flag;
      inst.parent = parent;
      await inst.save();

      const again = new LangFlagEntity();
      again.flag = flag;
      again.parent = parent;
      await expect(again.save()).rejects.toThrow();
    });

    test('Shouldn`t add without flag', async () => {
      const parent = await Object.assign(new LangEntity(), { id: 'UA' }).save();

      const inst = new LangFlagEntity();
      inst.parent = parent;
      await expect(inst.save()).rejects.toThrow();
    });

    test('Shouldn`t add without parent', async () => {
      const flag = await Object.assign(new FlagEntity(), { id: 'NAME', label: 'name' }).save();

      const inst = new LangFlagEntity();
      inst.flag = flag;
      await expect(inst.save()).rejects.toThrow();
    });
  });

  describe('Lang with flags', () => {
    test('Should add item', async () => {
      const parent = await Object.assign(new LangEntity(), { id: 'UA' }).save();

      for (let i = 0; i < 10; i++) {
        const flag = await Object.assign(new FlagEntity(), { id: `NAME_${i}`, label: 'name' }).save();

        const inst = new LangFlagEntity();
        inst.flag = flag;
        inst.parent = parent;
        await inst.save();
      }

      const repo = source.getRepository(LangEntity);

      const item = await repo.findOne({
        where: {id: 'UA'},
        relations: {flag: true},
      })

      expect(item.flag).toHaveLength(10);
    });
  });
});