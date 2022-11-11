import { Test } from '@nestjs/testing';
import { PropertyQueryResolver } from './property-query.resolver';
import { AppModule } from '../../../app.module';
import { createConnection } from 'typeorm';
import { PropertyEntity } from '../../model/property.entity';
import request from 'supertest-graphql';
import { gql } from 'apollo-server-express';
import { createConnectionOptions } from '../../../createConnectionOptions';

const propertyListQuery = gql`
  query getPropertyList($limit: Int, $offset: Int){
    property {
      list(limit: $limit, offset: $offset) {
        id
      }
    }
  }
`;

const propertyCountQuery = gql`
  query getPropertyList($limit: Int, $offset: Int){
    property {
      count(limit: $limit, offset: $offset)
    }
  }
`;

describe('PropertyQueryResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Property list', () => {
    test("Should get empty list", async () => {
      const res = await request(app.getHttpServer())
        .query(propertyListQuery)
        .expectNoErrors();

      expect(res.data['property']['list']).toHaveLength(0);
    });

    test('Should get single element list', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .query(propertyListQuery)
        .expectNoErrors();

      expect(res.data['property']['list']).toHaveLength(1);
      expect(res.data['property']['list'][0]['id']).toBe('NAME');
    });

    test("Should get list", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new PropertyEntity(), { id: `NAME_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(propertyListQuery)
        .expectNoErrors();

      expect(res.data['property']['list']).toHaveLength(10);
      expect(res.data['property']['list'][0]['id']).toBe('NAME_0');
      expect(res.data['property']['list'][9]['id']).toBe('NAME_9');
    });

    test('Should get list with limit', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new PropertyEntity(), { id: `NAME_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(propertyListQuery, { limit: 6 })
        .expectNoErrors();

      expect(res.data['property']['list']).toHaveLength(6);
      expect(res.data['property']['list'][5]['id']).toBe('NAME_5');
    });

    test('Should get list with offset', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new PropertyEntity(), { id: `NAME_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(propertyListQuery, { offset: 5 })
        .expectNoErrors();

      expect(res.data['property']['list']).toHaveLength(5);
      expect(res.data['property']['list'][0]['id']).toBe('NAME_5');
    });

    test('Should get list with limit and offset', async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new PropertyEntity(), { id: `NAME_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(propertyListQuery, { offset: 3, limit: 3 })
        .expectNoErrors();

      expect(res.data['property']['list']).toHaveLength(3);
      expect(res.data['property']['list'][0]['id']).toBe('NAME_3');
    });
  });

  describe('Property count', () => {
    test("Should get count for empty list", async () => {
      const res = await request(app.getHttpServer())
        .query(propertyCountQuery)
        .expectNoErrors();

      expect(res.data['property']['count']).toBe(0);
    });

    test('Should get single property count', async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      const res = await request(app.getHttpServer())
        .query(propertyCountQuery)
        .expectNoErrors();

      expect(res.data['property']['count']).toBe(1);
    });

    test('Should get property count', async () => {
      for (let i = 1; i <= 10; i++) {
        await Object.assign(new PropertyEntity(), { id: `NAME_${i}` }).save();
      }

      const res = await request(app.getHttpServer())
        .query(propertyCountQuery)
        .expectNoErrors();

      expect(res.data['property']['count']).toBe(10);
    });
  });
});
