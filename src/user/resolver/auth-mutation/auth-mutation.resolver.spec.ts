import { AuthMutationResolver } from './auth-mutation.resolver';
import { createConnection } from 'typeorm';
import { UserEntity } from '../../model/user.entity';
import request from 'supertest-graphql';
import { AppModule } from '../../../app.module';
import { gql } from 'apollo-server-express';
import { Test } from '@nestjs/testing';
import { createConnectionOptions } from '../../../createConnectionOptions';
import { UserContactEntity, UserContactType } from '../../model/user-contact.entity';
import { User2userContactEntity } from '../../model/user2user-contact.entity';

const loginQuery = gql`
  mutation Auth($login: String!, $password: String!) {
    auth {
      authByLogin(login: $login, password: $password) {
        id
        login
        hash
      }
    }
  }
`;

const contactQuery = gql`
  mutation Auth($contact: String!, $value: String!, $password: String!) {
    auth {
      authByContact(contact: $contact, value: $value, password: $password) {
        id
        login
        hash
      }
    }
  }
`;

const logoutMutation = gql`
  mutation Logout {
    auth {
      logout
    }
  }
`;

describe('AuthMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({
      imports: [ AppModule ],
    }).compile();
    app = moduleBuilder.createNestApplication();
    app.init();

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Auth with login and password', () => {
    test('Should auth', async () => {
      await Object.assign(new UserEntity(), {
        login: 'admin',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
      }).save();

      const res = await request(app.getHttpServer())
        .query(loginQuery, {
          login: 'admin',
          password: 'qwerty',
        })
        .expectNoErrors();

      expect(res.data['auth']['authByLogin']['login']).toBe('admin');
    });

    test('Shouldn`t auth with wrong password', async () => {
      await Object.assign(new UserEntity(), {
        login: 'admin',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
      }).save();

      const res = await request(app.getHttpServer())
        .query(loginQuery, {
          login: 'admin',
          password: 'wrong',
        })
        .expectNoErrors();

      expect(res.data['auth']['authByLogin']).toBe(null);
    });

    test('Shouldn`t auth without user', async () => {
      const res = await request(app.getHttpServer())
        .query(loginQuery, {
          login: 'admin',
          password: 'password',
        })
        .expectNoErrors();

      expect(res.data['auth']['authByLogin']).toBe(null);
    });
  });

  describe('Auth with contact and password', () => {
    test('Should auth with contact', async () => {
      const parent = await Object.assign(new UserEntity(), {
        login: 'admin',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
      }).save();

      const contact = await Object.assign(new UserContactEntity(), {
        id: 'mail',
        type: UserContactType.EMAIL,
      }).save();

      await Object.assign(new User2userContactEntity(), {
        parent,
        contact,
        value: 'user@mail.com',
        verify: false,
        verifyCode: '123',
      }).save();

      const res = await request(app.getHttpServer())
        .query(contactQuery, {
          contact: 'mail',
          value: 'user@mail.com',
          password: 'qwerty',
        })
        .expectNoErrors();

      expect(res.data['auth']['authByContact']['login']).toBe('admin');
    });
  });

  describe('Logout', () => {
    test('Should logout', async () => {
      await Object.assign(new UserEntity(), {
        login: 'admin',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
      }).save();

      const user = await request(app.getHttpServer())
        .query(loginQuery, {
          login: 'admin',
          password: 'qwerty',
        })
        .expectNoErrors();

      const cookie = user.response.headers['set-cookie'];

      const res = await request(app.getHttpServer())
        .set('cookie', cookie)
        .mutate(logoutMutation)
        .expectNoErrors();

      expect(res.data['auth']['logout']).toBeTruthy();
    });

    test('Shouldn`t logout without session', async () => {
      const res = await request(app.getHttpServer())
        .mutate(logoutMutation)
        .expectNoErrors();

      expect(res.data['auth']['logout']).toBeFalsy();
    });
  });
});
