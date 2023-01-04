import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserEntity } from "./user.entity";
import { UserContactEntity, UserContactType } from "./user-contact.entity";
import { User2userContactEntity } from "./user2user-contact.entity";

describe('User Contact entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User with contacts', () => {
    test('Should create user with contact', async () => {
      const repo = source.getRepository(UserEntity);
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();
      const contact = await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();

      await Object.assign(new User2userContactEntity(), {
        user,
        contact,
        value: 'mail@mail.com'
      }).save();

      const res = await repo.findOne({ where: { id: user.id }, relations: { contact: true } });

      expect(res.contact).toHaveLength(1);
      expect(res.contact[0].value).toBe('mail@mail.com');
    });
  });
});