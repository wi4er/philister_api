import { Test, TestingModule } from '@nestjs/testing';
import { PropertyQueryResolver } from './property-query.resolver';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../../app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import redisPermission from "../../../permission/redis.permission";
import { createConnection } from "typeorm";
import { UserEntity } from "../../../user/model/user.entity";
import { UserPropertyEntity } from "../../../user/model/user-property.entity";
import { PropertyEntity } from "../../model/property.entity";
import request from "supertest-graphql";
import { gql } from "apollo-server-express";


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
    await NestFactory.create(AppModule, new ExpressAdapter());

    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.use(redisPermission());
    app.init()

    source = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'example',
      database: 'postgres',
      synchronize: true,
      // logging: true,
      entities: [ UserEntity, UserPropertyEntity, PropertyEntity ],
      subscribers: [],
      migrations: [],
    });
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
