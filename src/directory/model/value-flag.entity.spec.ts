import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { DirectoryEntity } from "./directory.entity";
import { FlagEntity } from "../../flag/model/flag.entity";
import { DirectoryFlagEntity } from "./directory-flag.entity";
import { ValueEntity } from "./value.entity";
import { ValueFlagEntity } from "./value-flag.entity";

describe("ValueFlag entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('ValueFlag fields', () => {
    test('Should create', async () => {
      const directory = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      const parent = await Object.assign(new ValueEntity(), { id: 'London', directory }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const inst = new ValueFlagEntity();
      inst.parent = parent;
      inst.flag = flag;

      await inst.save();

      expect(inst.id).toBe(1);
      expect(inst.created_at).toBeDefined();
      expect(inst.updated_at).toBeDefined();
      expect(inst.deleted_at).toBe(null);
      expect(inst.version).toBe(1);
      expect(inst.flag.id).toBe('ACTIVE');
      expect(inst.parent.id).toBe('London');
    });
  });
});