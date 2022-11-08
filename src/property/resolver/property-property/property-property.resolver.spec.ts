import { Test } from '@nestjs/testing';
import { PropertyPropertyResolver } from './property-property.resolver';
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

const propertyPropertyListQuery = gql`
  {
    property {
      list {
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

describe('PropertyPropertyResolver', () => {
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

  describe('Property property list', () => {
    test("Should get list", async () => {
      await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new PropertyEntity(), {
        id: 'VALUE',

      }).save();

      const res = await request(app.getHttpServer())
        .query(propertyPropertyListQuery)
        .expectNoErrors();

      expect(res.data['property']['list']).toHaveLength(0);
    });
  });
});
