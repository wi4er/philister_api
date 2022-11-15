import { Test, TestingModule } from '@nestjs/testing';
import { ValueMutationResolver } from './value-mutation.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { DirectoryEntity } from "../../model/directory.entity";
import { ValueEntity } from "../../model/value.entity";

const addValueMutation = gql`
  mutation AddValue($item: ValueInput!) {
    value {
      add(item: $item) {
        id
        directory {
          id
        }
      }
    }
  }
`;

const deleteValueMutation = gql`
  mutation deleteValue($id: [String!]!){
    value {
      delete(id: $id)
    }
  }
`;

describe('ValueMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Value addition', () => {
    test("Should add value", async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addValueMutation, { item: { id: 'London', directory: 'CITY' } })
        .expectNoErrors();

      expect(res.data['value']['add']['id']).toBe('London');
    });

    test("Shouldn't add with wrong directory", async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addValueMutation, { item: { id: 'London', directory: 'WRONG' } });

      expect(res.errors[0].path).toEqual(['value', 'add']);
    });

    test("Shouldn't add without directory", async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addValueMutation, { item: { id: 'London' } });

      expect(res.errors[0].extensions).toEqual({ code: 'BAD_USER_INPUT' });
    });
  });

  describe('Directory deletion', () => {
    test('Should delete item', async () => {
      await Object.assign(new ValueEntity(), { id: 'London' }).save();

      const res = await request(app.getHttpServer())
        .mutate(deleteValueMutation, {id: 'London'})
        .expectNoErrors();

      expect(res.data['value']['delete']).toEqual(['London']);
    });

    test('Should delete list', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new ValueEntity(), { id: `London_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .mutate(deleteValueMutation, {id: ['London_0', 'London_3', 'London_5']})
        .expectNoErrors();

      expect(res.data['value']['delete']).toEqual(['London_0', 'London_3', 'London_5']);
    });
  });
});
