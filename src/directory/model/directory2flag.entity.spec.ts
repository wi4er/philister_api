import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { DirectoryEntity } from "./directory.entity";
import { FlagEntity } from "../../flag/model/flag.entity";
import { Directory2flagEntity } from "./directory2flag.entity";

describe("DirectoryFlag entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('DirectoryFlag fields', () => {
    test('Should create', async () => {
      const parent = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const inst = new Directory2flagEntity();
      inst.parent = parent;
      inst.flag = flag;

      await inst.save();

      expect(inst.id).toBe(1);
      expect(inst.created_at).toBeDefined();
      expect(inst.updated_at).toBeDefined();
      expect(inst.deleted_at).toBe(null);
      expect(inst.version).toBe(1);
      expect(inst.flag.id).toBe('ACTIVE');
      expect(inst.parent.id).toBe('CITY');
    });
  });
});