import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { SectionEntity } from "./section.entity";
import { BlockEntity } from "./block.entity";

describe("Section entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Section fields', () => {
    test("Should create section", async () => {
      const block = await new BlockEntity().save();
      const section = await Object.assign(new SectionEntity(), { block }).save();

      expect(section.id).toBe(1);
    });

    test('Should get empty list', async () => {
      const repo = source.getRepository(SectionEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });
});