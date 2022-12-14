import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { DirectoryEntity } from "./directory.entity";
import { DirectoryStringEntity } from "./directory-string.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { LangEntity } from "../../lang/model/lang.entity";

describe("DirectoryString entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('DirectoryString fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(DirectoryStringEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should create item', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      const parent = await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();

      await Object.assign(new DirectoryStringEntity(), {
        string: 'VALUE', property, parent, lang
      }).save();
    });

    test('Should create without lang', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();

      const inst = await Object.assign(new DirectoryStringEntity(), {
        string: 'VALUE', property, parent
      }).save()

      expect(inst.lang).toBeUndefined();
    });

    test('Shouldn`t create without property', async () => {
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      const parent = await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();

      await expect(Object.assign(new DirectoryStringEntity(), {
        string: 'VALUE', parent, lang
      }).save()).rejects.toThrow('propertyId');
    });

    test('Shouldn`t create without parent', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();

      await expect(Object.assign(new DirectoryStringEntity(), {
        string: 'VALUE', property, lang
      }).save()).rejects.toThrow('parentId');
    });
  });

  describe('Directory with string', () => {
    test('Should create directory with string', async () => {
      const repo = source.getRepository(DirectoryEntity);
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      const parent = await Object.assign(new DirectoryEntity(), { id: 'ENUM' }).save();

      await Object.assign(new DirectoryStringEntity(), {
        string: 'VALUE', property, parent, lang
      }).save();

      const inst = await repo.findOne({
        relations: { string: true },
        where: { id: 'ENUM' }
      });

      expect(inst.string).toHaveLength(1);
    });

    test('Should create directory with string list', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();

      for (let i = 0; i < 10; i++) {
        await Object.assign(new DirectoryStringEntity(), {
          string: 'VALUE',
          property: 'NAME',
          parent: 'LIST',
          lang: 'EN',
        }).save();
      }

      const repo = source.getRepository(DirectoryEntity);
      const item = await repo.findOne({ where: { id: "LIST" }, relations: { string: true } });

      expect(item.string).toHaveLength(10);
    });

    test('Should clear string after directory deletion', async () => {
      const repo = source.getRepository(DirectoryEntity);
      const stingRepo = source.getRepository(DirectoryStringEntity);
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();

      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new DirectoryEntity(), { id: 'ENUM' }).save();

      await Object.assign(new DirectoryStringEntity(), { string: 'VALUE', property, parent, lang }).save();
      await repo.delete({ id: 'ENUM' });

      expect(await stingRepo.find()).toEqual([]);
    });
  });
});