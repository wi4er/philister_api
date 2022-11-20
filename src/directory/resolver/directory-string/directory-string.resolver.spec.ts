import { Test } from '@nestjs/testing';
import { DirectoryStringResolver } from './directory-string.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../../property/model/property.entity";
import { DirectoryEntity } from "../../model/directory.entity";
import { DirectoryStringEntity } from "../../model/directory-string.entity";

const directoryItemQuery = gql`
  query getDirectoryList($id: String!) {
    directory {
      item(id: $id) {
        id
        property {
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
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new DirectoryEntity(), { id: 'NAME' }).save();
      await Object.assign(new DirectoryStringEntity(), { string: 'VALUE', property, parent }).save()

      const res = await request(app.getHttpServer())
        .mutate(directoryItemQuery, { id: 'NAME' })
        .expectNoErrors();

      expect(res.data['directory']['item']['property']).toHaveLength(1);
      expect(res.data['directory']['item']['property'][0]['string']).toBe('VALUE');
      expect(res.data['directory']['item']['property'][0]['property']['id']).toBe('NAME');
    });

    test("Should get directory with property list", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new PropertyEntity(), { id: 'SECOND' }).save();
      await Object.assign(new PropertyEntity(), { id: 'FAMILY' }).save();
      const parent = await Object.assign(new DirectoryEntity(), { id: 'NAME' }).save();

      await Object.assign(new DirectoryStringEntity(), { string: 'VALUE', property: 'NAME', parent }).save();
      await Object.assign(new DirectoryStringEntity(), { string: 'VALUE', property: 'SECOND', parent }).save();
      await Object.assign(new DirectoryStringEntity(), { string: 'VALUE', property: 'FAMILY', parent }).save();

      const res = await request(app.getHttpServer())
        .mutate(directoryItemQuery, { id: 'NAME' })
        .expectNoErrors();

      expect(res.data['directory']['item']['property']).toHaveLength(3);
      expect(res.data['directory']['item']['property'][0]['string']).toBe('VALUE');
      expect(res.data['directory']['item']['property'][0]['property']['id']).toBe('NAME');
      expect(res.data['directory']['item']['property'][1]['property']['id']).toBe('SECOND');
      expect(res.data['directory']['item']['property'][2]['property']['id']).toBe('FAMILY');
    });
  });
});
