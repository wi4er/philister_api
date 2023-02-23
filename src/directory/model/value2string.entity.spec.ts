import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { DirectoryEntity } from "./directory.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { Value2stringEntity } from "./value2string.entity";
import { ValueEntity } from "./value.entity";
import { LangEntity } from "../../lang/model/lang.entity";

describe("ValueString entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('ValueString fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(Value2stringEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should create item', async () => {
      const repo = source.getRepository(Value2stringEntity);

      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'ENUM' }).save();
      const parent = await Object.assign(new ValueEntity(), { id: 'ITEM', directory, property }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();

      await Object.assign(new Value2stringEntity(), {
        string: 'VALUE', property, parent, lang
      }).save();

      const item = await repo.findOne({where: {id: 1}, loadRelationIds: true});

      expect(item.id).toBe(1);
      expect(item.property).toBe('NAME');
      expect(item.parent).toBe('ITEM');
      expect(item.lang).toBe('EN');
    });
  });

  describe('Value with string', () => {
    test('Should create directory with string', async () => {
      const repo = source.getRepository(ValueEntity);

      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'ENUM' }).save();
      const parent = await Object.assign(new ValueEntity(), { id: 'ITEM', directory, property }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();

      await Object.assign(new Value2stringEntity(), {
        string: 'VALUE', property, parent, lang
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
      const stingRepo = source.getRepository(Value2stringEntity);

      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const directory = await Object.assign(new DirectoryEntity(), { id: 'ENUM' }).save();
      const parent = await Object.assign(new ValueEntity(), { id: 'ITEM', directory, property }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();

      await Object.assign(new Value2stringEntity(), { string: 'VALUE', property, parent, lang }).save();
      await repo.delete({ id: 'ITEM' });

      expect(await stingRepo.find()).toEqual([]);
    });
  });
});