import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { ValueEntity } from "./value.entity";
import { DirectoryEntity } from "./directory.entity";

describe("Directory entity", () => {
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
      const inst = await Object.assign(new ValueEntity(), {
        id: 'NAME',
      }).save();

      expect(inst['id']).toBe('NAME');
    });

    test('Should get single value', async () => {
      const repo = source.getRepository(ValueEntity);
      await Object.assign(new ValueEntity(), { id: 'NAME' }).save();

      const item = await repo.findOne({ where: { id: 'NAME' } });
      expect(item['id']).toBe('NAME');
    });
  });

  describe('Value with directory', () => {
    test('Should add value with directory', async () => {
      const dir = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const repo = source.getRepository(ValueEntity);
      await Object.assign(new ValueEntity(), {
        id: 'London',
        directory: dir,
      }).save();

      const list = await repo.find({relations: {directory: true}});

      expect(list[0]['id']).toBe('London');
      expect(list[0]['directory']['id']).toBe('CITY');
    });
  });
});