import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { BlockEntity } from "./block.entity";

describe("Block entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Block fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(BlockEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test("Should create item", async () => {
      const inst = new BlockEntity();
      await inst.save();

      expect(inst.created_at).toBeDefined();
      expect(inst.updated_at).toBeDefined();
      expect(inst.deleted_at).toBeNull();
      expect(inst.version).toBe(1);
    });
  });
});