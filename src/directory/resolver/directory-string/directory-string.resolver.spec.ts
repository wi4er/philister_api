import { Test } from '@nestjs/testing';
import { DirectoryStringResolver } from './directory-string.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../../property/model/property.entity";
import { DirectoryEntity } from "../../model/directory.entity";
import { Directory2stringEntity } from "../../model/directory2string.entity";
import { LangEntity } from "../../../lang/model/lang.entity";

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
          ... on DirectoryString {
            lang {
              id
            }
          }
        }
      }
    }
  }
`;

describe('DirectoryStringResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('DirectoryString fields', () => {
    test("Should get directory string", async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new DirectoryEntity(), { id: 'NAME' }).save();
      const lang = await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(new Directory2stringEntity(), { string: 'VALUE', property, parent, lang }).save()

      const res = await request(app.getHttpServer())
        .mutate(directoryItemQuery, { id: 'NAME' })
        .expectNoErrors();

      expect(res.data['directory']['item']['property']).toHaveLength(1);
      expect(res.data['directory']['item']['property'][0]['string']).toBe('VALUE');
      expect(res.data['directory']['item']['property'][0]['property']['id']).toBe('NAME');
      expect(res.data['directory']['item']['property'][0]['lang']['id']).toBe('EN');
    });

    test("Should get directory with property list", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new PropertyEntity(), { id: 'SECOND' }).save();
      await Object.assign(new PropertyEntity(), { id: 'FAMILY' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      await Object.assign(new Directory2stringEntity(), { string: 'VALUE', property: 'NAME', parent: 'CITY', lang: 'EN' }).save();
      await Object.assign(new Directory2stringEntity(), { string: 'VALUE', property: 'SECOND', parent: 'CITY', lang: 'EN' }).save();
      await Object.assign(new Directory2stringEntity(), { string: 'VALUE', property: 'FAMILY', parent: 'CITY', lang: 'EN' }).save();

      const res = await request(app.getHttpServer())
        .mutate(directoryItemQuery, { id: 'CITY' })
        .expectNoErrors();

      expect(res.data['directory']['item']['property']).toHaveLength(3);
      expect(res.data['directory']['item']['property'][0]['string']).toBe('VALUE');
      expect(res.data['directory']['item']['property'][0]['property']['id']).toBe('NAME');
      expect(res.data['directory']['item']['property'][1]['property']['id']).toBe('SECOND');
      expect(res.data['directory']['item']['property'][2]['property']['id']).toBe('FAMILY');
    });
  });
});
