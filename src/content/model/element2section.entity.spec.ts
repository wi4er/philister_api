import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { Element2sectionEntity } from "./element2section.entity";

describe("ElementSection entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('ElementSection fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(Element2sectionEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });
});