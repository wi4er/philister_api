import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { PropertyEntity } from "../../property/model/property.entity";
import { UserEntity } from "./user.entity";
import { UserStringEntity } from "./user-string.entity";

describe('User entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe("User with string property", () => {
    test("Should create user with property", async () => {
      const prop = await Object.assign(new PropertyEntity(), { id: "NAME" }).save();
      const user = await Object.assign(
        new UserEntity(), {
          login: "USER",
          string: [
            await Object.assign(new UserStringEntity(), { string: "TEST", property: prop }).save()
          ]
        }
      ).save();

      expect(user.string).toHaveLength(1);
      expect(user.string[0].string).toBe("TEST");
      expect(user.string[0].property.id).toBe("NAME");
    });

    test("Should create user with list of properties", async () => {
      const prop1 = await Object.assign(new PropertyEntity(), { id: "PROP_1" }).save();
      const prop2 = await Object.assign(new PropertyEntity(), { id: "PROP_2" }).save();
      const prop3 = await Object.assign(new PropertyEntity(), { id: "PROP_3" }).save();

      const user = await Object.assign(
        new UserEntity(), {
          login: "USER",
          string: [
            await Object.assign(new UserStringEntity(), { string: "TEST_1", property: prop1 }).save(),
            await Object.assign(new UserStringEntity(), { string: "TEST_2", property: prop2 }).save(),
            await Object.assign(new UserStringEntity(), { string: "TEST_3", property: prop3 }).save(),
          ]
        }
      ).save();

      expect(user.string).toHaveLength(3);
      expect(user.string[0].string).toBe("TEST_1");
      expect(user.string[0].property.id).toBe("PROP_1");

      expect(user.string[1].string).toBe("TEST_2");
      expect(user.string[1].property.id).toBe("PROP_2");

      expect(user.string[2].string).toBe("TEST_3");
      expect(user.string[2].property.id).toBe("PROP_3");
    });
  });
});