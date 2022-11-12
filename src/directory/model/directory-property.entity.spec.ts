import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { DirectoryEntity } from "./directory.entity";
import { DirectoryPropertyEntity } from "./directory-property.entity";
import { PropertyEntity } from "../../property/model/property.entity";

describe("Directory entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('DirectoryProperty fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(DirectoryPropertyEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });

  describe('Directory with property', () => {
    test('Should create directory with property', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const direct = await Object.assign(new DirectoryEntity(), {
        id: 'ENUM',
        property: [
          await Object.assign(new DirectoryPropertyEntity(), { value: 'VALUE', property }).save(),
        ]
      }).save();

      expect(direct.property).toHaveLength(1);
      expect(direct.property[0].id).toBe(1);
    });
  });
});