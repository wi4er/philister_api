import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../../app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import redisPermission from "../../../permission/redis.permission";
import { createConnection } from "typeorm";
import { UserPropertyEntity } from "../../model/user-property.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserEntity } from "../../model/user.entity";
import { PropertyPropertyEntity } from "../../../property/model/property-property.entity";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";

const userItemQuery = gql`
  query GetUser($id: Int!){
    user {
      item(id: $id) {
        id
        login
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

describe('UserResolver', () => {
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
      entities: [ UserEntity, UserPropertyEntity, PropertyEntity, PropertyPropertyEntity ],
      subscribers: [],
      migrations: [],
    });
  });

  beforeEach(() => source.synchronize(true));

  describe('User fields', () => {
    test('Should get user list', async () => {
      const user = await Object.assign(new UserEntity(),{login: 'user'}).save();

      const res = await request(app.getHttpServer())
        .query(userItemQuery, {id: user.id})
        .expectNoErrors();

      expect(res.data['user']['item']['id']).toBe(1);
      expect(res.data['user']['item']['login']).toBe('user');
    });
  });

  describe('User property', () => {
    test('Should get user with property', async () => {
      const property = await Object.assign(new PropertyEntity(),{id: 'name'}).save();
      const user = await Object.assign(new UserEntity(),{
        login: 'user',
        property: [
          await Object.assign(new UserPropertyEntity(), {value: "VALUE", property}).save()
        ]
      }).save();

      const res = await request(app.getHttpServer())
        .query(userItemQuery, {id: user.id})
        .expectNoErrors();

      console.log(res.data['user']['item'])
    });
  });
});
