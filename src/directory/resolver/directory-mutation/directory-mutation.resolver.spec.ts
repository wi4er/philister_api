import { Test } from '@nestjs/testing';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../../property/model/property.entity";

const addDirectoryMutation = gql`
  mutation addDirectory($item: DirectoryInput!) {
    directory {
      add(item: $item) {
        id
        property {
          value
          property {
            id
          }
        }
      }
    }
  }
`

describe('DirectoryQueryResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Directory addition', () => {
    test("Should add directory", async () => {
      const res = await request(app.getHttpServer())
        .mutate(addDirectoryMutation, { item: { id: 'CITY' } })
        .expectNoErrors();

      expect(res.data['directory']['add']['id']).toBe('CITY');
    });

    test("Should add directory with property", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const res = await request(app.getHttpServer())
        .mutate(addDirectoryMutation, {
          item: {
            id: 'CITY',
            property: [ { value: 'VALUE', property: 'NAME' } ]
          }
        })
        .expectNoErrors();

      expect(res.data['directory']['add']['id']).toBe('CITY');
    });
  });
});
