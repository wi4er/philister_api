import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { SectionEntity } from "./section.entity";
import { BlockEntity } from "./block.entity";
import { Element2valueEntity } from "./element2value.entity";
import { ElementEntity } from "./element.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { DirectoryEntity } from "../../directory/model/directory.entity";
import { ValueEntity } from "../../directory/model/value.entity";
import { SectionValueEntity } from "./section-value.entity";

describe("SectionValue entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('SectionValue fields', () => {
    test("Should create section value", async () => {
      const block = await new BlockEntity().save();
      const parent = await Object.assign(new SectionEntity(), { block }).save();
      const property = await Object.assign(new PropertyEntity(), { id: 'CURRENT' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      const value = await Object.assign(new ValueEntity(), { id: 'LONDON', directory }).save();

      const inst = await Object.assign(new SectionValueEntity(), { parent, property, value }).save();

      expect(inst.id).toBe(1);
    });

    test('Should get empty list', async () => {
      const repo = source.getRepository(SectionEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });
});