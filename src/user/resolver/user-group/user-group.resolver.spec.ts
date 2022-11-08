import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupResolver } from './user-group.resolver';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../../app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import redisPermission from "../../../permission/redis.permission";
import { createConnection } from "typeorm";
import { UserEntity } from "../../model/user.entity";
import { UserPropertyEntity } from "../../model/user-property.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";

const userPropertyQuery = gql`
  {
    user {
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

describe('UserGroupResolver', () => {
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

  it('Should get with property', async () => {
    const prop = await Object.assign(new PropertyEntity(), {id: 'name'}).save();
    await Object.assign(new UserEntity(), {
      login: 'myself',
      property: [
        await Object.assign(new UserPropertyEntity(), { value: "VALUE", property: prop }).save()
      ]
    }).save();

    const res = await request(app.getHttpServer())
      .query(userPropertyQuery)
      .expectNoErrors();

    expect(res.data['user']['list']).toHaveLength(1);
    expect(res.data['user']['list'][0]['property']).toHaveLength(1);
    expect(res.data['user']['list'][0]['property'][0]['property']['id']).toBe('name');
  });

  it('Should get with list of properties', async () => {
    const prop1 = await Object.assign(new PropertyEntity(), {id: 'PROP_1'}).save();
    const prop2 = await Object.assign(new PropertyEntity(), {id: 'PROP_2'}).save();
    const prop3 = await Object.assign(new PropertyEntity(), {id: 'PROP_3'}).save();
    const prop4 = await Object.assign(new PropertyEntity(), {id: 'PROP_4'}).save();
    const prop5 = await Object.assign(new PropertyEntity(), {id: 'PROP_5'}).save();

    await Object.assign(
      new UserEntity(),
      {
        login: 'admin',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5'
      }
    ).save();
    await Object.assign(new UserEntity(), {
      login: 'user_1',
      property: [
        await Object.assign(new UserPropertyEntity(), { value: "VALUE_1", property: prop1 }).save(),
        await Object.assign(new UserPropertyEntity(), { value: "VALUE_2", property: prop2 }).save(),
        await Object.assign(new UserPropertyEntity(), { value: "VALUE_3", property: prop3 }).save(),
      ]
    }).save();
    await Object.assign(new UserEntity(), {
      login: 'user_2',
      property: [
        await Object.assign(new UserPropertyEntity(), { value: "VALUE_2", property: prop2 }).save(),
        await Object.assign(new UserPropertyEntity(), { value: "VALUE_3", property: prop3 }).save(),
        await Object.assign(new UserPropertyEntity(), { value: "VALUE_4", property: prop4 }).save(),
      ]
    }).save();
    await Object.assign(new UserEntity(), {
      login: 'user_3',
      property: [
        await Object.assign(new UserPropertyEntity(), { value: "VALUE_3", property: prop3 }).save(),
        await Object.assign(new UserPropertyEntity(), { value: "VALUE_4", property: prop4 }).save(),
        await Object.assign(new UserPropertyEntity(), { value: "VALUE_5", property: prop5 }).save(),
      ]
    }).save();

    const res = await request(app.getHttpServer())
      .query(userPropertyQuery)
      .expectNoErrors();

    expect(res.data['user']['list']).toHaveLength(4);
    expect(res.data['user']['list'][1]['property']).toHaveLength(3);
    expect(res.data['user']['list'][1]['property'][0]['property']['id']).toBe('PROP_1');
  });
});
