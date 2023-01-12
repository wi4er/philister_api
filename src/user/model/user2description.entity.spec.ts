import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserEntity } from "./user.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { User2descriptionEntity } from "./user2description.entity";

describe('User2description entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe("User with description property", () => {
    test("Should create user with description", async () => {
      const repo = source.getRepository(UserEntity);
      const property = await Object.assign(new PropertyEntity(), { id: "NAME" }).save();
      const parent = await Object.assign(new UserEntity(), { login: "USER" }).save();

      await Object.assign(new User2descriptionEntity(), { description: "TEST", property, parent }).save();

      const inst = await repo.findOne({ where: { id: 1 }, relations: { description: { property: true } } });

      expect(inst.description).toHaveLength(1);
      expect(inst.description[0].description).toBe("TEST");
      expect(inst.description[0].property.id).toBe("NAME");
    });

    test("Should create user with list of properties", async () => {
      const repo = source.getRepository(UserEntity);

      const prop1 = await Object.assign(new PropertyEntity(), { id: "PROP_1" }).save();
      const prop2 = await Object.assign(new PropertyEntity(), { id: "PROP_2" }).save();
      const prop3 = await Object.assign(new PropertyEntity(), { id: "PROP_3" }).save();

      const parent = await Object.assign(new UserEntity(), { login: "USER" }).save();

      await Object.assign(new User2descriptionEntity(), { description: "TEST_1", property: prop1, parent }).save();
      await Object.assign(new User2descriptionEntity(), { description: "TEST_2", property: prop2, parent }).save();
      await Object.assign(new User2descriptionEntity(), { description: "TEST_3", property: prop3, parent }).save();

      const inst = await repo.findOne({ where: { id: 1 }, relations: { description: { property: true } } });

      expect(inst.description).toHaveLength(3);
      expect(inst.description[0].description).toBe("TEST_1");
      expect(inst.description[0].property.id).toBe("PROP_1");

      expect(inst.description[1].description).toBe("TEST_2");
      expect(inst.description[1].property.id).toBe("PROP_2");

      expect(inst.description[2].description).toBe("TEST_3");
      expect(inst.description[2].property.id).toBe("PROP_3");
    });

    test('Shouldn`t create user without parent', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'PARENT' }).save();
      const inst = await Object.assign(new User2descriptionEntity(), { description: 'VALUE', property });

      await expect(inst.save()).rejects.toThrow('parentId');
    });

    test('Shouldn`t create user without property', async () => {
      const parent = await Object.assign(new UserEntity(), { login: 'PARENT' }).save();
      const inst = await Object.assign(new User2descriptionEntity(), { description: 'VALUE', parent });

      await expect(inst.save()).rejects.toThrow('propertyId');
    });

    test('Shouldn`t create user without string', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'PARENT' }).save();
      const parent = await Object.assign(new UserEntity(), { login: 'PARENT' }).save();
      const inst = await Object.assign(new User2descriptionEntity(), { parent, property });

      await expect(inst.save()).rejects.toThrow('description');
    });
  });
});