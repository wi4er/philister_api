import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserGroupEntity } from "./user-group.entity";
import { UserEntity } from "./user.entity";
import { User2userGroupEntity } from "./user2user-group.entity";

describe('User to UserGroup entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User2UserGroup fields', () => {
    test('Should create', async () => {

    });
  });

  describe('User with groups', () => {
    test('Should create user with group', async () => {
      const repo = source.getRepository(UserEntity);

      const parent = await Object.assign(new UserEntity(), { login: 'user' }).save();
      const group = await Object.assign(new UserGroupEntity(), {}).save();

      await Object.assign(new User2userGroupEntity(), { parent, group }).save();

    });
  });
});
