import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserEntity } from "./user.entity";
import { FlagEntity } from "../../flag/model/flag.entity";
import { UserFlagEntity } from "./user-flag.entity";

describe('UserFlag entity', () => {

  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe("User with flags", () => {
    test('Should add item', async () => {
      const repo = source.getRepository(UserEntity);
      const flag = await Object.assign(new FlagEntity(), { id: 'DATA', label: '' }).save();

      await Object.assign(
        new UserEntity(),
        {
          login: 'USER',
          flag: [
            await Object.assign(new UserFlagEntity(), { flag }).save()
          ]
        }
      ).save();

      const list = await repo.find({ relations: { flag: true } });

      expect(list).toHaveLength(1);
      expect(list[0].flag).toHaveLength(1);
      expect(list[0].flag[0].id).toBe(1);
    });
  });
});