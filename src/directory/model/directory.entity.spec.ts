import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { DirectoryEntity } from "./directory.entity";
import { ValueEntity } from "./value.entity";

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
        expect(inst.created_at).not.toBeUndefined();
        expect(inst.updated_at).not.toBeUndefined();
        expect(inst.deleted_at).toBeNull();
        expect(inst.version).toBe(1);
        expect(inst.id).toBe('NAME');
    });

    test('Shouldn`t create with same id',  () => {
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

    test('Should get single element list', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'NAME' }).save();

      const repo = source.getRepository(DirectoryEntity);
      const list = await repo.find();

      expect(list).toHaveLength(1);
    });
  });

  describe('Directory with values', () => {
    test('Should create directory with value', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();
      await Object.assign(new ValueEntity(), { id: 'ITEM', directory: 'LIST' }).save();

      const repo = source.getRepository(DirectoryEntity);
      const list = await repo.find({ relations: { value: true } });

      expect(list).toHaveLength(1);
      expect(list[0]['value'][0]['id']).toBe('ITEM');
    });

    test('Should create directory with list of values', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();
      for (let i = 0; i < 10; i++) {
        await Object.assign(new ValueEntity(), { id: `ITEM_${i}`, directory: 'LIST' }).save();
      }

      const repo = source.getRepository(DirectoryEntity);
      const item = await repo.findOne({
        where: { id: 'LIST' },
        relations: { value: true },
      });

      expect(item['value']).toHaveLength(10);
    });
  });
});