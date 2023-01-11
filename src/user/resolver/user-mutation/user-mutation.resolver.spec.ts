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

const userAddMutation = gql`
  mutation AddUser($item: UserInput!) {
    user {
      add(item: $item) {
        id
        login
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
            contact: [],
            property: [],
            flag: [],
          }
        });

      expect(res.data['user']['add']['id']).toBe(1);
      expect(res.data['user']['add']['login']).toBe('admin');
    });

    it('Should add user with 0 id', async () => {
      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            id: 0,
            login: 'admin',
            contact: [],
            property: [],
            flag: [],
          }
        });

      expect(res.data['user']['add']['id']).toBe(1);
      expect(res.data['user']['add']['login']).toBe('admin');
    });

    test('Should add user with flag', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            login: 'admin',
            contact: [],
            property: [],
            flag: [ 'ACTIVE' ],
          }
        });

      expect(res.data['user']['add']['flagString']).toEqual([ 'ACTIVE' ]);
    });

    test('Should add user with string', async () => {
      await Object.assign(new PropertyEntity(), { id: 'SIZE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(userAddMutation, {
          item: {
            login: 'admin',
            contact: [],
            property: [{
              property: 'SIZE',
              string: 'XXL',
            }],
            flag: [],
          }
        });

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
            contact: [{
              contact: 'mail',
              value: 'user@mail.com'
            }],
            property: [],
            flag: [],
          }
        });

      expect(res.data['user']['add']['contact']).toHaveLength(1);
      expect(res.data['user']['add']['contact'][0]['value']).toBe('user@mail.com');
      expect(res.data['user']['add']['contact'][0]['contact']['id']).toBe('mail');
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
            contact: [],
            property: [],
            flag: [],
          }
        });

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
            contact: [],
            property: [{
              property: 'NAME',
              string: 'John',
            }],
            flag: [],
          }
        });

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
            contact: [],
            property: [],
            flag: [],
          }
        });

      expect(res.data['user']['update']['propertyList']).toHaveLength(0);
    });
  });

  describe('User deletion', () => {
    test('Should delete', async () => {
      await Object.assign(new UserEntity(), { login: 'NAME' }).save();
      const res = await request(app.getHttpServer())
        .mutate(userDeleteMutation, { id: 1 });

      expect(res.data['user']['delete']).toEqual([1]);
    });
  });
});
