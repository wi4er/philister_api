import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { UserEntity } from "../../user/model/user.entity";
import { UserPropertyEntity } from "../../user/model/user-property.entity";
import { PropertyEntity } from "./property.entity";
import { PropertyPropertyEntity } from "./property-property.entity";

describe("Property entity", () => {

  let source: DataSource;

  beforeAll(async () => {
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

  describe('Property fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(PropertyEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should get single element list', async () => {
      await Object.assign(new PropertyEntity(), {id: 'NAME'}).save();

      const repo = source.getRepository(PropertyEntity);
      const list = await repo.find();

      expect(list).toHaveLength(1);
    });
  });
})