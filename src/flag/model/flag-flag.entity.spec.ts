import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { FlagEntity } from "./flag.entity";
import { FlagFlagEntity } from "./flag-flag.entity";

describe("Flag entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Flag with flag', () => {
    test('Should add item with flag', async () => {
      const repo = source.getRepository(FlagEntity);
      const active = await Object.assign(new FlagEntity(), { id: 'ACTIVE', label: 'active flag' }).save();

      const item = new FlagEntity();
      item.id = 'ITEM';
      item.label = 'Some item';
      item.flag = [
        await Object.assign(new FlagFlagEntity(), { flag: 'ACTIVE' }).save()
      ];
      await item.save();

      const list = await repo.findOne({
        where: { id: 'ITEM' },
        loadRelationIds: true,
        // relations: {flag: true},
      });

      console.log(list)

      // expect(list.flag[0]['id']).toBe(1);
    });

    test('Shouldn`t create flag with duplicate flag', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE', label: 'active' }).save();

      const flag = await Object.assign(new FlagEntity(), {
        id: 'FLAG',
        label: 'active',
        flag: [
          await Object.assign(new FlagFlagEntity(), { flag: 'ACTIVE' }).save(),
          await Object.assign(new FlagFlagEntity(), { flag: 'ACTIVE' }).save(),
          await Object.assign(new FlagFlagEntity(), { flag: 'ACTIVE' }).save(),
        ]
      });

      await expect(flag.save()).rejects.toThrow();
    });
  });
});