import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { FlagEntity } from "./flag.entity";

describe("Flag entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Flag fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(FlagEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should get single element list', async () => {
      await Object.assign(new FlagEntity(), {id: 'ACTIVE', label: 'active'}).save();

      const repo = source.getRepository(FlagEntity);
      const list = await repo.find();

      expect(list).toHaveLength(1);
    });

    test('Shouldn`t create without label', async () => {
      const flag = Object.assign(new FlagEntity(), {id: 'ACTIVE'});
      await expect(flag.save()).rejects.toThrow();
    });
  });
});