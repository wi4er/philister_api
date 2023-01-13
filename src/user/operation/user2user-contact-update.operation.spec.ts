import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserEntity } from "../model/user.entity";
import { User2userContactUpdateOperation } from "./user2user-contact-update.operation";
import { UserContactEntity, UserContactType } from "../model/user-contact.entity";
import { User2userContactEntity } from "../model/user2user-contact.entity";

describe('User 2 userContact update operation', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe("User fields", () => {
    test('Should add contact to user', async () => {
      const repo = source.getRepository(UserEntity);
      await Object.assign(new UserEntity(), { login: 'user' }).save();
      await Object.assign(new UserContactEntity(), { id: 'phone', type: UserContactType.PHONE }).save();

      const operation = new User2userContactUpdateOperation(source.manager);

      await operation.save(
        await repo.findOne({ where: { id: 1 }, loadRelationIds: true }),
        {
          id: 1,
          login: 'user',
          group: [], contact: [ {
            contact: 'phone',
            value: '123'
          } ],
          property: [],
          flag: [],
        });

      const user = await repo.findOne({ where: { id: 1 }, relations: { contact: { contact: true } } });

      expect(user.contact).toHaveLength(1);
      expect(user.contact[0].value).toBe('123');
      expect(user.contact[0].contact.id).toBe('phone');
    });

    test('Should update contact in user', async () => {
      const repo = source.getRepository(UserEntity);
      const parent = await Object.assign(new UserEntity(), { login: 'user' }).save();
      const contact = await Object.assign(new UserContactEntity(), { id: 'phone', type: UserContactType.PHONE }).save();
      await Object.assign(
        new User2userContactEntity(),
        { parent, contact, value: 'OLD', verify: false, verifyCode: '123123' }
      ).save();

      const operation = new User2userContactUpdateOperation(source.manager);

      await operation.save(
        await repo.findOne({ where: { id: 1 }, relations: { contact: { contact: true } } }),
        {
          id: 1,
          login: 'user',
          group: [], contact: [ {
            contact: 'phone',
            value: 'NEW'
          } ],
          property: [],
          flag: [],
        });

      const user = await repo.findOne({ where: { id: 1 }, relations: { contact: { contact: true } } });

      expect(user.contact).toHaveLength(1);
      expect(user.contact[0].value).toBe('NEW');
    });
  });
});