import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { DirectoryEntity } from "./directory.entity";
import { DirectoryStringEntity } from "./directory-string.entity";
import { PropertyEntity } from "../../property/model/property.entity";

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
  });

  describe('Directory with property', () => {
    test('Should create directory with string', async () => {
      const repo = source.getRepository(DirectoryEntity);
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new DirectoryEntity(), {id: 'ENUM'}).save();

      await Object.assign(new DirectoryStringEntity(), {
        string: 'VALUE', property, parent
      }).save();

      const inst = await repo.findOne({
        relations: {property: true},
        where: {id: 'ENUM'}
      });

      expect(inst.property).toHaveLength(1);
    });

    test('Should clear string after directory deletion', async () => {
      const repo = source.getRepository(DirectoryEntity);
      const stingRepo = source.getRepository(DirectoryStringEntity);

      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new DirectoryEntity(), {id: 'ENUM'}).save();

      await Object.assign(new DirectoryStringEntity(), {string: 'VALUE', property, parent}).save();
      await repo.delete({id: 'ENUM'});

      expect(await stingRepo.find()).toEqual([]);
    });
  });
});