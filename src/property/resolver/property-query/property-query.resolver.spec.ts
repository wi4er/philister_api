import { Test } from '@nestjs/testing';
import { PropertyQueryResolver } from './property-query.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { PropertyEntity } from "../../model/property.entity";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";
import { createConnectionOptions } from "../../../createConnectionOptions";

const propertyListQuery = gql`
  {
    property {
      list {
        id
      }
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

    test("Should get single element list", async () => {
      await Object.assign(new PropertyEntity(), {id: 'NAME'}).save();

      const res = await request(app.getHttpServer())
        .query(propertyListQuery)
        .expectNoErrors();

      expect(res.data['property']['list']).toHaveLength(1);
      expect(res.data['property']['list'][0]['id']).toBe('NAME');
    });

    test("Should get list", async () => {
      for (let i = 0; i < 10; i++) {
        await Object.assign(new PropertyEntity(), {id: `NAME_${i}`}).save();
      }

      const res = await request(app.getHttpServer())
        .query(propertyListQuery)
        .expectNoErrors();

      expect(res.data['property']['list']).toHaveLength(10);
      expect(res.data['property']['list'][0]['id']).toBe('NAME_0');
      expect(res.data['property']['list'][9]['id']).toBe('NAME_9');
    });
  });
});
