import { Test } from '@nestjs/testing';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { PropertyEntity } from "../../../property/model/property.entity";
import { DirectoryEntity } from "../../model/directory.entity";
import { ValueEntity } from "../../model/value.entity";
import { LangEntity } from "../../../lang/model/lang.entity";
import { FlagEntity } from "../../../flag/model/flag.entity";
import { DirectoryFlagEntity } from "../../model/directory-flag.entity";

const addDirectoryMutation = gql`
  mutation addDirectory($item: DirectoryInput!) {
    directory {
      add(item: $item) {
        id
        property {
          string
          property {
            id
          }
        }
        value {
          id
        }
      }
    }
  }
`;

const updateDirectoryMutation = gql`
  mutation updateDirectory($item: DirectoryInput!) {
    directory {
      update(item: $item) {
        id
        property {
          string
          property {
            id
          }
        }
        value {
          id
        }
        flag: flagString
      }
    }
  }
`;

const deleteDirectoryMutation = gql`
  mutation deleteDirectory($id: [String!]!) {
    directory {
      delete(id: $id)
    }
  }
`

describe('DirectoryMutationResolver', () => {
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

    test("Shouldn't add directory with blank id", async () => {
      const res = await request(app.getHttpServer())
        .mutate(addDirectoryMutation, { item: { id: '' } });

      expect(res.errors).toHaveLength(1);
    });

    test("Should add directory with property", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'GR' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addDirectoryMutation, {
          item: {
            id: 'CITY',
            property: [ { string: 'VALUE', property: 'NAME', lang: 'GR' } ]
          }
        })
        .expectNoErrors();

      expect(res.data['directory']['add']['id']).toBe('CITY');
      expect(res.data['directory']['add']['property']).toHaveLength(1);
      expect(res.data['directory']['add']['property'][0]['string']).toBe('VALUE');
    });

    test("Should add directory with values", async () => {
      const res = await request(app.getHttpServer())
        .mutate(addDirectoryMutation, {
          item: {
            id: 'CITY',
            value: [ 'LONDON' ]
          }
        })
        .expectNoErrors();

      expect(res.data['directory']['add']['id']).toBe('CITY');
      expect(res.data['directory']['add']['value']).toHaveLength(1);
      expect(res.data['directory']['add']['value'][0]['id']).toBe('LONDON');
    });
  });

  describe('Directory update', () => {
    test('Should update item with string', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'GR' }).save();
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateDirectoryMutation, {
          item: {
            id: 'CITY',
            property: [ {
              string: 'VALUE',
              property: 'NAME',
              lang: 'GR',
            } ],
            value: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['directory']['update']['property'][0]['string']).toBe('VALUE');
    });

    test('Shouldn`t change directory', async () => {
      const directory = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), { id: 'LONDON', directory }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateDirectoryMutation, {
          item: {
            id: 'CITY',
            property: [],
            value: [ 'LONDON' ]
          }
        })
        .expectNoErrors();

      expect(res.data['directory']['update']['value']).toHaveLength(1);
      expect(res.data['directory']['update']['value'][0]['id']).toBe('LONDON');
    });

    test('Should add values to directory', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateDirectoryMutation, {
          item: {
            id: 'CITY',
            property: [],
            value: [ 'LONDON' ]
          }
        })
        .expectNoErrors();

      expect(res.data['directory']['update']['value']).toHaveLength(1);
      expect(res.data['directory']['update']['value'][0]['id']).toBe('LONDON');
    });

    test('Should delete values from directory', async () => {
      const directory = await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new ValueEntity(), { id: 'LONDON', directory }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateDirectoryMutation, {
          item: {
            id: 'CITY',
            property: [],
            value: []
          }
        })
        .expectNoErrors();

      expect(res.data['directory']['update']['value']).toHaveLength(0);
    });
  });

  describe('Directory update with flags', () => {
    test('Should update item with flag', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateDirectoryMutation, {
          item: {
            id: 'CITY',
            property: [],
            value: [],
            flag: [ 'ACTIVE' ],
          }
        })
        .expectNoErrors();

      expect(res.data['directory']['update']['flag']).toEqual([ 'ACTIVE' ]);
    });

    test('Should delete flags in update', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new DirectoryFlagEntity(), { parent: 'CITY', flag: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateDirectoryMutation, {
          item: {
            id: 'CITY',
            property: [],
            value: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['directory']['update']['flag']).toEqual([]);
    });

    test('Should change flags in item', async () => {
      await Object.assign(new FlagEntity(), { id: 'FIRST' }).save();
      await Object.assign(new FlagEntity(), { id: 'SECOND' }).save();
      await Object.assign(new FlagEntity(), { id: 'THIRD' }).save();

      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();
      await Object.assign(new DirectoryFlagEntity(), { parent: 'CITY', flag: 'FIRST' }).save();
      await Object.assign(new DirectoryFlagEntity(), { parent: 'CITY', flag: 'SECOND' }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateDirectoryMutation, {
          item: {
            id: 'CITY',
            property: [],
            value: [],
            flag: [ 'FIRST', 'THIRD' ],
          }
        })
        .expectNoErrors();

      expect(res.data['directory']['update']['flag']).toEqual([ 'FIRST', 'THIRD' ]);
    });
  });

  describe('Directory deletion', () => {
    test('Should delete item', async () => {
      await Object.assign(new DirectoryEntity(), { id: 'CITY' }).save();

      const res = await request(app.getHttpServer())
        .mutate(deleteDirectoryMutation, { id: 'CITY' })
        .expectNoErrors();

      expect(res.data['directory']['delete']).toEqual([ 'CITY' ]);
    });

    test('Should delete list', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new DirectoryEntity(), { id: `CITY_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .mutate(deleteDirectoryMutation, { id: [ 'CITY_0', 'CITY_3', 'CITY_5' ] })
        .expectNoErrors();

      expect(res.data['directory']['delete']).toEqual([ 'CITY_0', 'CITY_3', 'CITY_5' ]);
    });
  });
});
