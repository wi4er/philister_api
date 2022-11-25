import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { PropertyEntity } from "../../property/model/property.entity";
import { BlockEntity } from "./block.entity";
import { SectionStringEntity } from "./section-string.entity";
import { SectionEntity } from "./section.entity";

describe("SectionString entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('SectionString fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(SectionStringEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Shouldn`t create without parent', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      await expect(Object.assign(new SectionStringEntity(), { string: 'VALUE', property }).save()).rejects.toThrow();
    });

    test('Shouldn`t create without property', async () => {
      const block = await new BlockEntity().save();
      const parent = await Object.assign(new SectionEntity(), {block}).save();

      await expect(Object.assign(new SectionStringEntity(), { string: 'VALUE', parent }).save()).rejects.toThrow();
    });
  });

  describe('Section with strings', () => {
    test('Should create element with strings', async () => {
      const repo = source.getRepository(SectionEntity);

      const block = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new SectionEntity(), {block}).save();

      await Object.assign(new SectionStringEntity(), { string: 'VALUE', parent, property }).save();

      const inst = await repo.findOne({
        where: { id: parent.id },
        relations: { string: true },
      });

      expect(inst.string).toHaveLength(1);
      expect(inst.string[0].string).toBe('VALUE');
    });
  });
});