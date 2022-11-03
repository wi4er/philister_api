import { AuthMutationResolver } from './auth-mutation.resolver';
import { createConnection } from "typeorm";
import { UserEntity } from "../../model/user/user.entity";
import { UserPropertyEntity } from "../../model/user-property.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { NestFactory } from "@nestjs/core";
import request from 'supertest-graphql';
import { AppModule } from "../../../app.module";
import { gql } from "apollo-server-express";
import { ExpressAdapter } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";

describe('AuthMutationResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    await NestFactory.create(AppModule, new ExpressAdapter(app));

    const moduleBuilder = await Test.createTestingModule({
      imports: [ AppModule ],
    }).compile();

    app = moduleBuilder.createNestApplication(undefined, {
      logger: false,
    })

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

  it('should be defined', () => {

  });

    test("Shouldn't auth without user", async () => {
        const query = gql`
            {
                user {
                    item {
                        id
                    }
                }
            }
        `;

      const res = await request(app.getHttpServer())
        .query(query)
        .expectNoErrors();

      // expect(res.data['user'])
      console.log(res.data['user']);
    });

  test('Should auth', async () => {
    // await Object.assign(new UserEntity(), {
    //   login: 'USER',
    //   hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5'
    // }).save();
    //
    // const user = await resolver.getAuth('USER', 'qwerty')
    //
    // expect(user.login).toBe('USER');
  });
});
