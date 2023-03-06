import { Test } from '@nestjs/testing';
import { BlockQueryResolver } from './block-query.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../../createConnectionOptions';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { BlockEntity } from '../../model/block.entity';
import { UserEntity } from '../../../user/model/user.entity';
import { UserGroupEntity } from '../../../user/model/user-group.entity';
import { User2userGroupEntity } from '../../../user/model/user2user-group.entity';
import { BlockPermissionEntity } from '../../model/block-permission.entity';
import { PermissionMethod } from '../../../permission/model/permission-method';

const blockListQuery = gql`
  query getBlockList($limit: Int, $offset: Int) {
    block {
      list(limit: $limit, offset: $offset) {
        id
        version
        updated_at
        created_at
      }
    }
  }
`;

const blockCountQuery = gql`
  query getBlockCount($limit: Int, $offset: Int) {
    block {
      count(limit: $limit, offset: $offset)
    }
  }
`;

const blockItemQuery = gql`
  query getBlockItem($id: Int!) {
    block {
      item(id: $id) {
        id
        version
        updated_at
        created_at
      }
    }
  }
`;

const authQuery = gql`
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

async function createUser(app) {
  const parent = await Object.assign(
    new UserEntity(),
    {
      login: 'myself',
      hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
    },
  ).save();

  const group = await Object.assign(
    new UserGroupEntity(),
    {
      login: 'myself',
      hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
    },
  ).save();

  await Object.assign(new User2userGroupEntity(), { parent, group }).save();

  const auth = await request(app.getHttpServer())
    .query(authQuery, {
      login: 'myself',
      password: 'qwerty',
    })
    .expectNoErrors();

  return auth.response.headers['set-cookie'];
}

describe('BlockQueryResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init();

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Block list', () => {
    test('Should get empty list', async () => {
      const res = await request(app.getHttpServer())
        .query(blockListQuery)
        .expectNoErrors();

      expect(res.data['block']['list']).toHaveLength(0);
    });

    test('Should get list', async () => {
      const session = await createUser(app);

      for (let i = 0; i < 10; i++) {
        const block = await new BlockEntity().save();
        await Object.assign(
          new BlockPermissionEntity(),
          { block, group: 1, method: PermissionMethod.READ },
        ).save();
      }

      const res = await request(app.getHttpServer())
        .set('cookie', session)
        .query(blockListQuery)
        .expectNoErrors();

      expect(res.data['block']['list']).toHaveLength(10);
    });

    test('Should get list with permission', async () => {
      const session = await createUser(app);

      for (let i = 0; i < 10; i++) {
        const block = await new BlockEntity().save();
        i % 2 ? await Object.assign(
          new BlockPermissionEntity(),
          { block, group: 1, method: PermissionMethod.READ }
        ).save() : null;
      }

      const res = await request(app.getHttpServer())
        .set('cookie', session)
        .query(blockListQuery)
        .expectNoErrors();

      expect(res.data['block']['list']).toHaveLength(5);
      expect(res.data['block']['list'][0].id).toBe(2);
      expect(res.data['block']['list'][4].id).toBe(10);
    });
  });

  describe('Block count', () => {
    test('Should get zero count', async () => {
      const res = await request(app.getHttpServer())
        .query(blockCountQuery)
        .expectNoErrors();

      expect(res.data['block']['count']).toBe(0);
    });

    test('Should get count', async () => {
      for (let i = 0; i < 10; i++) {
        await new BlockEntity().save();
      }

      const res = await request(app.getHttpServer())
        .query(blockCountQuery)
        .expectNoErrors();

      expect(res.data['block']['count']).toBe(10);
    });
  });

  describe('Block item', () => {
    test('Should get item with wrong id', async () => {
      for (let i = 0; i < 10; i++) {
        await new BlockEntity().save();
      }

      const res = await request(app.getHttpServer())
        .query(blockItemQuery, { id: 11 })
        .expectNoErrors();

      expect(res.data['block']['item']).toBeNull();
    });

    test('Should get item', async () => {
      for (let i = 0; i < 10; i++) {
        await new BlockEntity().save();
      }

      const res = await request(app.getHttpServer())
        .query(blockItemQuery, { id: 5 })
        .expectNoErrors();

      expect(res.data['block']['item']['id']).toBe(5);
    });
  });
});
