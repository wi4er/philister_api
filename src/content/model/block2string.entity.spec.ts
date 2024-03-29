import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { Block2stringEntity } from "./block2string.entity";

describe("BlockString entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('BlockString fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(Block2stringEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });
});