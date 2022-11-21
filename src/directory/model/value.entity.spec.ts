import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { ValueEntity } from "./value.entity";
import { DirectoryEntity } from "./directory.entity";

describe("Value entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Value fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(ValueEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should add value', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();
      const inst = await Object.assign(new ValueEntity(), {
        id: 'NAME',
        directory: 'LIST'
      }).save();

      expect(inst['id']).toBe('NAME');
    });

    test('Shouldn`t add with blank id', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();
      const inst = await Object.assign(new ValueEntity(), {
        id: '',
        directory: 'LIST',
      });

      await expect(inst.save()).rejects.toThrow();
    });

    test('Should get single value', async () => {
      const repo = source.getRepository(ValueEntity);
      await Object.assign(new DirectoryEntity(), { id: 'LIST' }).save();
      await Object.assign(new ValueEntity(), { id: 'NAME', directory: 'LIST' }).save();

      const item = await repo.findOne({ where: { id: 'NAME' } });
      expect(item['id']).toBe('NAME');
    });
  });

  describe('Value with directory', () => {
    test('Should add value with directory', async () => {
      const repo = source.getRepository(ValueEntity);

      const dir = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), { id: 'London', directory: dir }).save();

      const list = await repo.find({ relations: { directory: true } });

      expect(list[0]['id']).toBe('London');
      expect(list[0]['directory']['id']).toBe('CITY');
    });
  });

  describe('Value deletion', () => {
    test('Should delete value after directory deletion', async () => {
      const repo = source.getRepository(DirectoryEntity);

      const dir = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), {
        id: 'London',
        directory: dir,
      }).save();

      await repo.delete({ id: 'CITY' });
      const item = await repo.findOne({ where: { id: 'London' } });

      expect(item).toBeNull();
    });
  });
});