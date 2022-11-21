import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { PropertyEntity } from "./property.entity";
import { createConnectionOptions } from "../../createConnectionOptions";

describe("Property entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Property fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(PropertyEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should add item', async () => {
      const inst = new PropertyEntity();
      inst.id = 'NAME';

      await inst.save();

      expect(inst.id).toBe('NAME');
    });

    test('Shouldn`t add with blank id', async () => {
      const inst = new PropertyEntity();
      inst.id = '';

      await expect(inst.save()).rejects.toThrow();
    });

    test('Should get single element list', async () => {
      await Object.assign(new PropertyEntity(), {id: 'NAME'}).save();

      const repo = source.getRepository(PropertyEntity);
      const list = await repo.find();

      expect(list).toHaveLength(1);
    });
  });
});