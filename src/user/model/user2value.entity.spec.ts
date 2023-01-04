import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserEntity } from "./user.entity";
import { ValueEntity } from "../../directory/model/value.entity";
import { DirectoryEntity } from "../../directory/model/directory.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { User2valueEntity } from "./user2value.entity";

describe('User entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe("User values", () => {
    test('Should create user with value', async () => {
      const repo = source.getRepository(UserEntity);

      await Object.assign(new DirectoryEntity(), {id: 'CITY'}).save();
      await Object.assign(new ValueEntity(), {id: 'LONDON', directory: 'CITY'}).save();
      await Object.assign(new PropertyEntity(), {id: 'CURRENT_CITY'}).save();

      const user = await Object.assign(new UserEntity(), {
        login: 'user',
        value: [
          await Object.assign(new User2valueEntity(), {property: 'CURRENT_CITY', value: 'LONDON'}).save(),
        ]
      }).save();

      const inst = await repo.findOne({where: {id: user.id}, relations: {value: true}});

      expect(inst.value[0].id).toBe(1);
    });

    test('Should create user with multi value', async () => {
      const repo = source.getRepository(UserEntity);

      await Object.assign(new DirectoryEntity(), {id: 'CITY'}).save();
      for (let i = 0; i < 10; i++) {
        await Object.assign(new ValueEntity(), {id: `LONDON_${i}`, directory: 'CITY'}).save();
      }
      await Object.assign(new PropertyEntity(), {id: 'CURRENT_CITY'}).save();

      const user = await Object.assign(new UserEntity(), {
        login: 'user',
        value: [
          await Object.assign(new User2valueEntity(), {property: 'CURRENT_CITY', value: 'LONDON_0'}).save(),
          await Object.assign(new User2valueEntity(), {property: 'CURRENT_CITY', value: 'LONDON_3'}).save(),
          await Object.assign(new User2valueEntity(), {property: 'CURRENT_CITY', value: 'LONDON_6'}).save(),
        ]
      }).save();

      const inst = await repo.findOne({where: {id: user.id}, relations: {value: true}});

      expect(inst.value).toHaveLength(3);
    });

    test('Shouldn`t create user with same value and property', async () => {
      const repo = source.getRepository(UserEntity);

      await Object.assign(new DirectoryEntity(), {id: 'CITY'}).save();
      await Object.assign(new ValueEntity(), {id: 'LONDON', directory: 'CITY'}).save();
      await Object.assign(new PropertyEntity(), {id: 'CURRENT_CITY'}).save();

      const user = await Object.assign(new UserEntity(), {
        login: 'user',
        value: [
          await Object.assign(new User2valueEntity(), { property: 'CURRENT_CITY', value: 'LONDON' }).save(),
          await Object.assign(new User2valueEntity(), { property: 'CURRENT_CITY', value: 'LONDON' }).save(),
        ]
      });

      await expect(user.save()).rejects.toThrow();
    });
  });
});