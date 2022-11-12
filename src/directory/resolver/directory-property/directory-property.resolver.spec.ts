import { Test } from '@nestjs/testing';
import { DirectoryPropertyResolver } from './directory-property.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../../property/model/property.entity";
import { DirectoryEntity } from "../../model/directory.entity";
import { DirectoryPropertyEntity } from "../../model/directory-property.entity";

const directoryItemQuery = gql`
  query getDirectoryList($id: String!) {
    directory {
      item(id: $id) {
        id
        property {
          id
          value
          property {
            id
          }
        }
      }
    }
  }
`;

describe('DirectoryPropertyResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('DirectoryProperty fields', () => {
    test("Should get directory property", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new DirectoryEntity(), {
        id: 'NAME',
        property: [
          await Object.assign(new DirectoryPropertyEntity(), { value: 'VALUE', property: 'NAME' }).save()
        ],
      }).save();

      const res = await request(app.getHttpServer())
        .mutate(directoryItemQuery, { id: 'NAME' })
        .expectNoErrors();

      expect(res.data['directory']['item']['property']).toHaveLength(1);
      expect(res.data['directory']['item']['property'][0]['value']).toBe('VALUE');
      expect(res.data['directory']['item']['property'][0]['property']['id']).toBe('NAME');
    });

    test("Should get directory with property list", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new PropertyEntity(), { id: 'SECOND' }).save();
      await Object.assign(new PropertyEntity(), { id: 'FAMILY' }).save();
      await Object.assign(new DirectoryEntity(), {
        id: 'NAME',
        property: [
          await Object.assign(new DirectoryPropertyEntity(), { value: 'VALUE', property: 'NAME' }).save(),
          await Object.assign(new DirectoryPropertyEntity(), { value: 'VALUE', property: 'SECOND' }).save(),
          await Object.assign(new DirectoryPropertyEntity(), { value: 'VALUE', property: 'FAMILY' }).save(),
        ],
      }).save();

      const res = await request(app.getHttpServer())
        .mutate(directoryItemQuery, { id: 'NAME' })
        .expectNoErrors();

      expect(res.data['directory']['item']['property']).toHaveLength(3);
      expect(res.data['directory']['item']['property'][0]['value']).toBe('VALUE');
      expect(res.data['directory']['item']['property'][0]['property']['id']).toBe('NAME');
      expect(res.data['directory']['item']['property'][1]['property']['id']).toBe('SECOND');
      expect(res.data['directory']['item']['property'][2]['property']['id']).toBe('FAMILY');
    });
  });
});
