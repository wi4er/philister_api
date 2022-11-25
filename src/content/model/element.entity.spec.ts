import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { ElementEntity } from "./element.entity";

describe("Element entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Element fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(ElementEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });
});