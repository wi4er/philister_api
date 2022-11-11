import { AppModule } from "./app.module";
import { Test } from "@nestjs/testing";
import { createConnection } from "typeorm";
import { UserEntity } from "./user/model/user.entity";
import { PropertyEntity } from "./property/model/property.entity";
import { PropertyPropertyEntity } from "./property/model/property-property.entity";
import { createConnectionOptions } from "./createConnectionOptions";


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
    const name = await Object.assign(new PropertyEntity(), {id: 'NAME'}).save();
    const second = await Object.assign(new PropertyEntity(), {id: 'SECOND_NAME'}).save();
    const descr = await Object.assign(new PropertyEntity(), {id: 'DESCRIPTION'}).save();

    for (let i = 0; i < 30; i++) {
      await Object.assign(new PropertyEntity(), {
        id: `PROP_${i}`,
        property: [
          await Object.assign(new PropertyPropertyEntity(), {value: `VALUE_${i}`, property: name}).save(),
          await Object.assign(new PropertyPropertyEntity(), {value: `SECOND_${i}`, property: second}).save(),
          await Object.assign(new PropertyPropertyEntity(), {value: `DESCRIPTION_${i}`, property: descr}).save(),
        ]
      }).save();
    }


    await Object.assign(
      new UserEntity(),
      {
        login: 'admin',
        hash: '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5'
      }
    ).save();


  });
});