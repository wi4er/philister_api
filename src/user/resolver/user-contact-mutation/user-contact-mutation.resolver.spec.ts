import { Test } from '@nestjs/testing';
import { UserContactMutationResolver } from './user-contact-mutation.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../../createConnectionOptions";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { UserContactEntity, UserContactType } from "../../model/user-contact.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { LangEntity } from "../../../lang/model/lang.entity";
import { FlagEntity } from "../../../flag/model/flag.entity";
import { UserContact2flagEntity } from "../../model/user-contact2flag.entity";

const addUserContact = gql`
  mutation AddUserContact($item: UserContactInput!) {
    userContact {
      add(item: $item) {
        id
        propertyList {
          id
          string
          property {
            id
          }
        }
        flagString
      }
    }
  }
`;

const updateUserContact = gql`
  mutation AddUserContact($item: UserContactInput!) {
    userContact {
      update(item: $item) {
        id
        type
        flagString
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

const deleteUserContact = gql`
  mutation DeleteUserContact($id: [String!]!) {
    userContact {
      delete(id: $id)
    }
  }
`;

const getUserContactItem = gql`
  query GetUserContact($id: String!) {
    userContact {
      item(id: $id) {
        id
        propertyList {
          id
          string
          property {
            id
          }
        }
        flagString
      }
    }
  }
`;

describe('UserContactMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('UserContact addition', () => {
    test('Should add user contact', async () => {
      const res = await request(app.getHttpServer())
        .mutate(addUserContact, {
          item: {
            id: 'mail',
            type: 'EMAIL',
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['add']['id']).toBe('mail');
    });

    test('Should add user contact with property', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addUserContact, {
          item: {
            id: 'mail',
            type: 'EMAIL',
            property: [ {
              property: 'NAME',
              string: 'VALUE'
            } ],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['add']['propertyList']).toHaveLength(1);
      expect(res.data['userContact']['add']['propertyList'][0]['string']).toBe('VALUE');
      expect(res.data['userContact']['add']['propertyList'][0]['property']['id']).toBe('NAME');
    });

    test('Should add user contact with lang properties', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new LangEntity(), { id: 'EN' }).save();
      await Object.assign(new LangEntity(), { id: 'GR' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addUserContact, {
          item: {
            id: 'phone',
            type: 'PHONE',
            property: [ {
              property: 'NAME',
              string: 'telephone',
              lang: 'EN',
            }, {
              property: 'NAME',
              string: 'telefon',
              lang: 'GR',
            } ],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['add']['propertyList']).toHaveLength(2);
      expect(res.data['userContact']['add']['propertyList'][0]['string']).toBe('telephone');
      expect(res.data['userContact']['add']['propertyList'][1]['string']).toBe('telefon');
    });

    test('Should add user contact with flag', async () => {
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(addUserContact, {
          item: {
            id: 'phone',
            type: 'PHONE',
            property: [],
            flag: [ 'ACTIVE' ],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['add']['flagString']).toEqual([ 'ACTIVE' ]);
    });
  });

  describe('UserContact update', () => {
    test('Should update contact', async () => {
      await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateUserContact, {
          item: {
            id: 'mail',
            type: 'PHONE',
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['update']['id']).toBe('mail');
      expect(res.data['userContact']['update']['type']).toBe('PHONE');
    });

    test('Should add property to contact', async () => {
      await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateUserContact, {
          item: {
            id: 'mail',
            type: 'PHONE',
            property: [{
              property: 'NAME',
              string: 'VALUE'
            }],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['update']['propertyList']).toHaveLength(1)
    });

    test('Should add flag to user contact', async () => {
      await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateUserContact, {
          item: {
            id: 'mail',
            type: 'PHONE',
            property: [],
            flag: [ 'ACTIVE' ],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['update']['flagString']).toEqual([ 'ACTIVE' ]);
    });

    test('Should update flag in user contact', async () => {
      await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();
      await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new FlagEntity(), { id: 'PASSIVE' }).save();
      await Object.assign(new UserContact2flagEntity(), {
        parent: 'mail',
        flag: 'ACTIVE',
      }).save();

      const res = await request(app.getHttpServer())
        .mutate(updateUserContact, {
          item: {
            id: 'mail',
            type: 'PHONE',
            property: [],
            flag: [ 'PASSIVE' ],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['update']['flagString']).toEqual([ 'PASSIVE' ]);
    });

    test('Should remove flag from user contact', async () => {
      await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();
      await Object.assign(new FlagEntity(), { id: 'PASSIVE' }).save();
      await Object.assign(new UserContact2flagEntity(), {
        parent: 'mail',
        flag: 'PASSIVE',
      }).save();

      const before = await request(app.getHttpServer())
        .query(getUserContactItem, { id: 'mail' })

      expect(before.data['userContact']['item']['flagString']).toEqual([ 'PASSIVE' ]);

      const res = await request(app.getHttpServer())
        .mutate(updateUserContact, {
          item: {
            id: 'mail',
            type: 'PHONE',
            property: [],
            flag: [],
          }
        })
        .expectNoErrors();

      expect(res.data['userContact']['update']['flagString']).toEqual([]);
    });
  });

  describe('UserContact deletion', () => {
    test('Should delete contact', async () => {
      await Object.assign(new UserContactEntity(), { id: 'mail', type: UserContactType.EMAIL }).save();
      const res = await request(app.getHttpServer())
        .mutate(deleteUserContact, { id: 'mail' })
        .expectNoErrors();

      expect(res.data['userContact']['delete']).toEqual([ 'mail' ]);
    });
  });
});
