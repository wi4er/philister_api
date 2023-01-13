import { Test } from '@nestjs/testing';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";
import { UserEntity } from "../../model/user.entity";
import { FlagEntity } from "../../../flag/model/flag.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserContactEntity, UserContactType } from "../../model/user-contact.entity";
import { User2stringEntity } from "../../model/user2string.entity";
import { UserContact2flagEntity } from "../../model/user-contact2flag.entity";
import { User2flagEntity } from "../../model/user2flag.entity";
import { User2userContactEntity } from "../../model/user2user-contact.entity";
import { UserGroupEntity } from "../../model/user-group.entity";

const userAddMutation = gql`
  mutation AddUser($item: UserInput!) {
    user {
      add(item: $item) {
        id
        login
        group {
          id
        }
        flagString
        propertyList {
          id
          string
          property {
            id
          }
        }
        contact {
          id
          value
          contact {
            id
          }
        }
      }
    }
  }
`;

const userUpdateMutation = gql`
  mutation UpdateUser($item: UserInput!) {
    user {
      update(item: $item) {
        id
        login
        propertyList {
          id
          string
          property {
            id
          }
        }
        contact {
          id
          value
          contact {
            id
          }
        }
      }
    }
  }
`;

const userDeleteMutation = gql`
  mutation DeleteUser($id: [Int!]!) {
    user {
      delete(id: $id)
    }
  }
`;

const updateUserFlagMutation = gql`
  mutation UpdateContactFlag($id: Int!, $flag: String!) {
    user {
      updateFlag(id: $id, flag: $flag) {
        id
        flagString
      }
    }
  }
`;

describe('UserMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('User addition', () => {
    it('Should add user', async () => {
      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            login: 'admin',
            group: [], contact: [],
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['add']['id']).toBe(1);
      expect(res.data['user']['add']['login']).toBe('admin');
    });

    it('Should add user with 0 id', async () => {
      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            id: 0,
            login: 'admin',
            group: [], contact: [],
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['add']['id']).toBe(1);
      expect(res.data['user']['add']['login']).toBe('admin');
    });

    test('Should add user with flag', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            login: 'admin',
            group: [], contact: [],
            property: [],
            flag: [ 'ACTIVE' ],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['add']['flagString']).toEqual([ 'ACTIVE' ]);
    });

    test('Should add user with string', async () => {
      await Object.assign(new PropertyEntity(), { id: 'SIZE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            login: 'admin',
            group: [], contact: [],
            property: [ {
              property: 'SIZE',
              string: 'XXL',
            } ],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['add']['propertyList']).toHaveLength(1);
      expect(res.data['user']['add']['propertyList'][0]['string']).toBe('XXL');
      expect(res.data['user']['add']['propertyList'][0]['property']['id']).toBe('SIZE');
    });

    test('Should add user with contact', async () => {
      await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();

      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            login: 'admin',
            group: [],
            contact: [ {
              contact: 'mail',
              value: 'user@mail.com'
            } ],
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['add']['contact']).toHaveLength(1);
      expect(res.data['user']['add']['contact'][0]['value']).toBe('user@mail.com');
      expect(res.data['user']['add']['contact'][0]['contact']['id']).toBe('mail');
    });

    test('Should add user with group', async () => {
      await new UserGroupEntity().save();

      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            login: 'admin',
            group: [ 1 ],
            contact: [],
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['add']['group']).toHaveLength(1);
      expect(res.data['user']['add']['group'][0]['id']).toBe(1);
    });

    test('Should add user with list of groups', async () => {
      for (let i = 0; i < 10; i++) {
        await new UserGroupEntity().save();
      }

      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            login: 'admin',
            group: [ 1, 3, 7 ],
            contact: [],
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['add']['group']).toHaveLength(3);
      expect(res.data['user']['add']['group'][0]['id']).toBe(1);
      expect(res.data['user']['add']['group'][1]['id']).toBe(3);
      expect(res.data['user']['add']['group'][2]['id']).toBe(7);
    });
  });

  describe('User update', () => {
    test('Should update user', async () => {
      const user = await Object.assign(new UserEntity(), { login: 'NAME' }).save();
      const res = await request(app.getHttpServer())
        .mutate(userUpdateMutation, {
          item: {
            id: user.id,
            login: 'admin',
            group: [], contact: [],
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['update']['login']).toBe('admin');
    });

    test('Should add property to user', async () => {
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .mutate(userUpdateMutation, {
          item: {
            id: user.id,
            login: 'admin',
            group: [], contact: [],
            property: [ {
              property: 'NAME',
              string: 'John',
            } ],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['update']['propertyList']).toHaveLength(1);
      expect(res.data['user']['update']['propertyList'][0]['string']).toBe('John');
      expect(res.data['user']['update']['propertyList'][0]['property']['id']).toBe('NAME');
    });

    test('Should remove property from user', async () => {
      const parent = await Object.assign(new UserEntity(), { login: 'user' }).save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new User2stringEntity(), { parent, property, string: 'VALUE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(userUpdateMutation, {
          item: {
            id: 1,
            login: 'admin',
            group: [], contact: [],
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['update']['propertyList']).toHaveLength(0);
    });

    test('Should add contact to user', async () => {
      const user = await Object.assign(new UserEntity(), { login: 'user' }).save();
      await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();

      const res = await request(app.getHttpServer())
        .mutate(userUpdateMutation, {
          item: {
            id: user.id,
            login: 'admin',
            group: [], contact: [ {
              contact: 'mail',
              value: 'mail@mail.com',
            } ],
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['update']['contact']).toHaveLength(1);
      expect(res.data['user']['update']['contact'][0]['value']).toBe('mail@mail.com');
      expect(res.data['user']['update']['contact'][0]['contact']['id']).toBe('mail');
    });

    test('Should remove contact from user', async () => {
      const parent = await Object.assign(new UserEntity(), { login: 'user' }).save();
      const contact = await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();
      await Object.assign(new User2userContactEntity(), { contact, parent, value: 'mail@mail.com' })

      const res = await request(app.getHttpServer())
        .mutate(userUpdateMutation, {
          item: {
            id: parent.id,
            login: 'admin',
            group: [], contact: [],
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['user']['update']['contact']).toHaveLength(0);
    });
  });

  describe('User updateFlag mutation', () => {
    test('Should update user flag', async () => {
      await Object.assign(new UserEntity(), { login: 'user' }).save();
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateUserFlagMutation, { id: 1, flag: 'ACTIVE' })
        .expectNoErrors();

      expect(res.data['user']['updateFlag']['flagString']).toEqual([ 'ACTIVE' ]);
    });

    test('Should remove user flag', async () => {
      await Object.assign(new UserEntity(), { login: 'user' }).save();
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new User2flagEntity(), { parent: 1, flag: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateUserFlagMutation, { id: 1, flag: 'ACTIVE' })
        .expectNoErrors();

      expect(res.data['user']['updateFlag']['flagString']).toEqual([]);
    });
  });

  describe('User deletion', () => {
    test('Should delete', async () => {
      await Object.assign(new UserEntity(), { login: 'NAME' }).save();
      const res = await request(app.getHttpServer())
        .mutate(userDeleteMutation, { id: 1 })
        .expectNoErrors();

      expect(res.data['user']['delete']).toEqual([ 1 ]);
    });
  });
});
