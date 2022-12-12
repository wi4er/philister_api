import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { DirectoryEntity } from "./directory.entity";

describe("Directory entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Directory fields', () => {
    test('Should create with id', async () => {
      const inst = new DirectoryEntity();
      inst.id = 'NAME';

      await inst.save();

      expect(inst.id).toBe('NAME');
      expect(inst.created_at).toBeDefined();
      expect(inst.updated_at).toBeDefined();
      expect(inst.deleted_at).toBeNull();
      expect(inst.version).toBe(1);
    });

    test('Shouldn`t create with blank id', async () => {
      const inst = new DirectoryEntity();
      inst.id = '';

      await expect(inst.save()).rejects.toThrow('id');
    });

    test('Shouldn`t create with same id', () => {
      // const inst = await Object.assign(new DirectoryEntity(), {id: 'NAME'}).save();
      //
      // setImmediate(async () => {
      //
      //   const another = await Object.assign(new DirectoryEntity(), {id: 'NAME'}).save()
      //
      //   done()
      //   console.log(another)
      // })
      // console.log(inst)
      // // console.log(another)
      // // await expect(Object.assign(new DirectoryEntity(), {id: 'NAME'}).save()).rejects.toThrow();
    });

    test('Should get empty list', async () => {
      const repo = source.getRepository(DirectoryEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should get single element', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'NAME' }).save();

      const repo = source.getRepository(DirectoryEntity);
      const item = await repo.findOne({ where: { id: 'NAME' } });

      expect(item.id).toBe('NAME');
    });
  });
});