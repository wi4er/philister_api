import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { LangEntity } from "./lang.entity";
import { createConnectionOptions } from "../../createConnectionOptions";

describe("Lang entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Lang fields', () => {
    test('Should add item with id', async () => {
      const inst = new LangEntity();
      inst.id = 'EN';

      await inst.save();

      expect(inst.id).toBe('EN');
      expect(inst.created_at).toBeDefined();
      expect(inst.updated_at).toBeDefined();
      expect(inst.deleted_at).toBeNull();
      expect(inst.version).toBe(1);
    });

    test('Shouldn`t add with blank id', async () => {
      const inst = new LangEntity();
      inst.id = '';

      await expect(inst.save()).rejects.toThrow();
    });

    test('Shouldn`t add with null id', async () => {
      const inst = new LangEntity();
      inst.id = null;

      await expect(inst.save()).rejects.toThrow();
    });

    test('Shouldn`t add with same id', async () => {
      const inst = new LangEntity();
      inst.id = 'EN';
      await inst.save();

      const same = new LangEntity();
      same.id = 'EN';
      await same.save()

      const repo = source.getRepository(LangEntity);
      const list = await repo.find();
      expect(list).toHaveLength(1);
    });

    test('Should update update_at', async () => {
      const inst = new LangEntity();
      inst.id = 'EN';

      await inst.save();
      const old = inst.updated_at;

      inst.version = 3;
      await inst.save();

      expect(inst.updated_at).not.toBe(old);
    });

    test('Should get empty list', async () => {
      const repo = source.getRepository(LangEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });
});