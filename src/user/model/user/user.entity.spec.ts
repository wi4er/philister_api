import { UserEntity } from './user.entity';
import { createConnection, Repository } from 'typeorm';
import { UserPropertyEntity } from '../user-property.entity';
import { PropertyEntity } from '../../../property/model/property.entity';
import { DataSource } from "typeorm/data-source/DataSource";

describe('User entity', () => {

  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'example',
      database: 'postgres',
      synchronize: true,
      // logging: true,
      entities: [ UserEntity, UserPropertyEntity, PropertyEntity ],
      subscribers: [],
      migrations: [],
    });
  });

  beforeEach(() => source.synchronize(true));

  describe("User fields", () => {
    test('Should add item', async () => {
      const repo = source.getRepository(UserEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should find item', async () => {
      const repo = source.getRepository(UserEntity) as Repository<UserEntity>;

      await Object.assign(new UserEntity(), { login: 'TEST' }).save();
      const list = await repo.find();

      expect(list).toHaveLength(1);
      expect(list[0].login).toBe('TEST');
    });
  });

  describe("User with property", () => {
    test("Should create user with property", async () => {
      const prop = await Object.assign(new PropertyEntity(), { id: "NAME" }).save();
      const user = await Object.assign(
        new UserEntity(), {
          login: "USER",
          property: [
            await Object.assign(new UserPropertyEntity(), { value: "TEST", property: prop }).save()
          ]
        }
      ).save();

      expect(user.property).toHaveLength(1);
      expect(user.property[0].value).toBe("TEST");
      expect(user.property[0].property.id).toBe("NAME");
    });

    test("Should create user with list of properties", async () => {
      const prop1 = await Object.assign(new PropertyEntity(), { id: "PROP_1" }).save();
      const prop2 = await Object.assign(new PropertyEntity(), { id: "PROP_2" }).save();
      const prop3 = await Object.assign(new PropertyEntity(), { id: "PROP_3" }).save();

      const user = await Object.assign(
        new UserEntity(), {
          login: "USER",
          property: [
            await Object.assign(new UserPropertyEntity(), { value: "TEST_1", property: prop1 }).save(),
            await Object.assign(new UserPropertyEntity(), { value: "TEST_2", property: prop2 }).save(),
            await Object.assign(new UserPropertyEntity(), { value: "TEST_3", property: prop2 }).save(),
          ]
        }
      ).save();

      expect(user.property).toHaveLength(3);
      expect(user.property[0].value).toBe("TEST_1");
      expect(user.property[1].value).toBe("TEST_2");
      expect(user.property[2].value).toBe("TEST_3");
      expect(user.property[0].property.id).toBe("PROP_1");
    });
  });
});