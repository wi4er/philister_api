import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserContactEntity, UserContactType } from "./user-contact.entity";
import { UserGroupEntity } from "./user-group.entity";

describe('UserGroup entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('UserGroup fields', () => {
    test('Should create', async () => {
      const inst = new UserGroupEntity();

      await inst.save();

      expect(inst.id).toBe(1);
      expect(inst.created_at).toBeDefined();
      expect(inst.updated_at).toBeDefined();
      expect(inst.deleted_at).toBeNull();
      expect(inst.version).toBe(1);
    });
  });

  describe('Group with parent', () => {
    test('Should create with parent', async () => {
      const repo = source.getRepository(UserGroupEntity);
      const parent = await new UserGroupEntity().save();

      const inst = new UserGroupEntity();
      inst.parent = parent;
      await inst.save();

      const some = await repo.findOne({ where: { id: inst.id }, relations: { parent: true } });

      expect(some.parent.id).toBe(parent.id);
    });

    test('Should create with child', async () => {
      const repo = source.getRepository(UserGroupEntity);
      const parent = await new UserGroupEntity().save();

      const inst = new UserGroupEntity();
      inst.parent = parent;
      await inst.save();

      const some = await repo.findOne({ where: { id: parent.id }, relations: { children: true } });

      expect(some.children).toHaveLength(1);
      expect(some.children[0].id).toBe(2);
    });
  });
});