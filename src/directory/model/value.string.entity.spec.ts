import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { DirectoryEntity } from "./directory.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { ValueStringEntity } from "./value.string.entity";
import { ValueEntity } from "./value.entity";

describe("ValueString entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('ValueString fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(ValueStringEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });

  describe('Value with property', () => {
    test('Should create directory with string', async () => {
      const repo = source.getRepository(ValueEntity);

      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'ENUM' }).save();
      const parent = await Object.assign(new ValueEntity(), { id: 'ITEM', directory, property }).save();

      await Object.assign(new ValueStringEntity(), {
        string: 'VALUE', property, parent
      }).save();

      const inst = await repo.findOne({
        relations: { string: true },
        where: { id: 'ITEM' }
      });

      expect(inst.string).toHaveLength(1);
      expect(inst.string[0].string).toBe('VALUE');
    });

    test('Should clear string after directory deletion', async () => {
      const repo = source.getRepository(ValueEntity);
      const stingRepo = source.getRepository(ValueStringEntity);

      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'ENUM' }).save();
      const parent = await Object.assign(new ValueEntity(), { id: 'ITEM', directory, property }).save();

      await Object.assign(new ValueStringEntity(), { string: 'VALUE', property, parent }).save();
      await repo.delete({ id: 'ITEM' });

      expect(await stingRepo.find()).toEqual([]);
    });
  });
});