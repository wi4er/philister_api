import { Test } from '@nestjs/testing';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";

const addBlockItemMutation = gql`
  mutation addBlockItem($item: BlockInput!) {
    block {
      add(item: $item) {
        id
        created_at
        updated_at
        version
        propertyList {
          id
          string
          property {
            id
          }
        }
      }
    }
  }
`;

describe('BlockMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Block addition', () => {
    test("Should add blank item ", async () => {
      const res = await request(app.getHttpServer())
        .mutate(addBlockItemMutation, {
          item: {}
        })
        .expectNoErrors();

      expect(res.data['block']['add']['id']).toBe(1);
    });
  });
});