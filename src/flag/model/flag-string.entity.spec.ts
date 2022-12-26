import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { FlagEntity } from "./flag.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { FlagStringEntity } from "./flag-string.entity";

describe("Flag property entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Flag property fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(FlagEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should create flag with property', async () => {
      const repo = source.getRepository(FlagEntity);

      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new FlagEntity(), {
        id: 'ACTIVE',
        label: 'activity',
      }).save();

      await Object.assign(new FlagStringEntity(), {
        string: 'Flag name',
        property: 'NAME',
        parent
      }).save()

      const item = await repo.findOne({ where: { id: 'ACTIVE' }, relations: { string: true } });

      expect(item['string']).toHaveLength(1);
      expect(item['string'][0]['id']).toBe(1);
    });

    test('Should delete flag property with property', async () => {
      const propRepo = source.getRepository(PropertyEntity);
      const flagRepo = source.getRepository(FlagEntity);

      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new FlagEntity(), {
        id: 'ACTIVE',
        label: 'activity',
      }).save();

      await Object.assign(new FlagStringEntity(), { string: 'Flag name', property: 'NAME', parent }).save()

      await propRepo.delete({ id: 'NAME' });
      const list = await flagRepo.find({ relations: { string: true } });

      expect(list).toHaveLength(1);
      expect(list[0].string).toEqual([]);
    });
  });
});