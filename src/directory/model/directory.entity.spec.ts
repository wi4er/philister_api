import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { DirectoryEntity } from "./directory.entity";

describe("Directory entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Directory fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(DirectoryEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should get single element list', async () => {
      await Object.assign(new DirectoryEntity(), {id: 'NAME'}).save();

      const repo = source.getRepository(DirectoryEntity);
      const list = await repo.find();

      expect(list).toHaveLength(1);
    });
  });
});