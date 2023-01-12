import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { PropertyEntity } from "../../property/model/property.entity";
import { UserEntity } from "./user.entity";
import { User2stringEntity } from "./user2string.entity";

describe('User2String entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe("User with string property", () => {
    test("Should create user with string", async () => {
      const repo = source.getRepository(UserEntity);
      const property = await Object.assign(new PropertyEntity(), { id: "NAME" }).save();
      const parent = await Object.assign(new UserEntity(), { login: "USER" }).save();

      await Object.assign(new User2stringEntity(), { string: "TEST", property, parent }).save();

      const inst = await repo.findOne({ where: { id: 1 }, relations: { string: { property: true } } });

      expect(inst.string).toHaveLength(1);
      expect(inst.string[0].string).toBe("TEST");
      expect(inst.string[0].property.id).toBe("NAME");
    });

    test("Should create user with list of properties", async () => {
      const repo = source.getRepository(UserEntity);

      const prop1 = await Object.assign(new PropertyEntity(), { id: "PROP_1" }).save();
      const prop2 = await Object.assign(new PropertyEntity(), { id: "PROP_2" }).save();
      const prop3 = await Object.assign(new PropertyEntity(), { id: "PROP_3" }).save();

      const parent = await Object.assign(new UserEntity(), { login: "USER" }).save();

      await Object.assign(new User2stringEntity(), { string: "TEST_1", property: prop1, parent }).save();
      await Object.assign(new User2stringEntity(), { string: "TEST_2", property: prop2, parent }).save();
      await Object.assign(new User2stringEntity(), { string: "TEST_3", property: prop3, parent }).save();

      const inst = await repo.findOne({ where: { id: 1 }, relations: { string: { property: true } } });

      expect(inst.string).toHaveLength(3);
      expect(inst.string[0].string).toBe("TEST_1");
      expect(inst.string[0].property.id).toBe("PROP_1");

      expect(inst.string[1].string).toBe("TEST_2");
      expect(inst.string[1].property.id).toBe("PROP_2");

      expect(inst.string[2].string).toBe("TEST_3");
      expect(inst.string[2].property.id).toBe("PROP_3");
    });

    test('Shouldn`t create user without parent', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'PARENT' }).save();
      const inst = await Object.assign(new User2stringEntity(), { string: 'VALUE', property });

      await expect(inst.save()).rejects.toThrow('parentId');
    });

    test('Shouldn`t create user without property', async () => {
      const parent = await Object.assign(new UserEntity(), { login: 'PARENT' }).save();
      const inst = await Object.assign(new User2stringEntity(), { string: 'VALUE', parent });

      await expect(inst.save()).rejects.toThrow('propertyId');
    });

    test('Shouldn`t create user without string', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'PARENT' }).save();
      const parent = await Object.assign(new UserEntity(), { login: 'PARENT' }).save();
      const inst = await Object.assign(new User2stringEntity(), { parent, property });

      await expect(inst.save()).rejects.toThrow('string');
    });
  });
});