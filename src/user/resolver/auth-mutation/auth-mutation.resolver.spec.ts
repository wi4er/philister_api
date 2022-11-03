import { Test, TestingModule } from '@nestjs/testing';
import { AuthMutationResolver } from './auth-mutation.resolver';
import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { UserEntity } from "../../model/user/user.entity";
import { UserPropertyEntity } from "../../model/user-property.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../../user.module";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

const ormProps = {
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
} as DataSourceOptions;

describe('AuthMutationResolver', () => {
  let resolver: AuthMutationResolver;
  let module: TestingModule;
  let source;

  beforeAll(async () => {
    source = await createConnection(ormProps);
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormProps),
        UserModule,
      ],
      providers: [],
    }).compile();

    resolver = module.get<AuthMutationResolver>(AuthMutationResolver);
  });

  beforeEach(() => source.synchronize(true));

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  test("Shouldn't auth without user", async () => {
    const user = await resolver.getAuth('USER', 'qwerty')

    expect(user).toBe(null);
  });

  test('Should auth', async () => {
    await Object.assign(new UserEntity(), {
      login: 'USER',
      hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5'
    }).save();

    const user = await resolver.getAuth('USER', 'qwerty')

    expect(user.login).toBe('USER');
  });
});
