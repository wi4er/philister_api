import { AppModule } from "./app.module";
import { Test } from "@nestjs/testing";
import { createConnection } from "typeorm";
import { UserEntity } from "./user/model/user.entity";
import { PropertyEntity } from "./property/model/property.entity";
import { PropertyPropertyEntity } from "./property/model/property-property.entity";
import { createConnectionOptions } from "./createConnectionOptions";
import { DirectoryEntity } from "./directory/model/directory.entity";
import { DirectoryStringEntity } from "./directory/model/directory-string.entity";
import { ValueEntity } from "./directory/model/value.entity";
import { UserStringEntity } from "./user/model/user-string.entity";
import { UserValueEntity } from "./user/model/user-value.entity";
import { UserUserEntity } from "./user/model/user-user.entity";
import { FlagEntity } from "./flag/model/flag.entity";
import { FlagStringEntity } from "./flag/model/flag-string.entity";
import { LangEntity } from "./lang/model/lang.entity";
import { LangStringEntity } from "./lang/model/lang-string.entity";

let source;
let app;

beforeAll(async () => {
  const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
  app = moduleBuilder.createNestApplication();
  app.init()

  source = await createConnection(createConnectionOptions());
});

beforeEach(() => source.synchronize(true));

describe('App mocks', () => {
  test.skip("Should populate", async () => {
    const name = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
    const second = await Object.assign(new PropertyEntity(), { id: 'SECOND_NAME' }).save();
    const descr = await Object.assign(new PropertyEntity(), { id: 'DESCRIPTION' }).save();
    const parent = await Object.assign(new PropertyEntity(), { id: 'PARENT' }).save();

    const active = await Object.assign(new FlagEntity(), {
      id: 'ACTIVE',
      label: 'active',
      string: [
        await Object.assign(new FlagStringEntity(), { string: 'active', property: 'NAME' }).save(),
        await Object.assign(new FlagStringEntity(), { string: 'active too', property: 'SECOND_NAME' }).save(),
      ]
    }).save();
    const passive = await Object.assign(new FlagEntity(), {
      id: 'PASSIVE',
      label: 'passive',
      string: [
        await Object.assign(new FlagStringEntity(), { string: 'passive', property: 'NAME' }).save(),
        await Object.assign(new FlagStringEntity(), { string: 'passive too', property: 'SECOND_NAME' }).save(),
      ]
    }).save();
    const actual = await Object.assign(new FlagEntity(), {
      id: 'ACTUAL',
      label: 'actual',
      string: [
        await Object.assign(new FlagStringEntity(), { string: 'actual', property: 'NAME' }).save(),
        await Object.assign(new FlagStringEntity(), { string: 'actual too', property: 'SECOND_NAME' }).save(),
      ]
    }).save();

    for (let i = 0; i < 50; i++) {
      await Object.assign(new PropertyEntity(), {
        id: `PROP_${i}`,
        property: [
          await Object.assign(new PropertyPropertyEntity(), { value: `VALUE_${i}`, property: name }).save(),
          await Object.assign(new PropertyPropertyEntity(), { value: `SECOND_${i}`, property: second }).save(),
          await Object.assign(new PropertyPropertyEntity(), { value: `DESCRIPTION_${i}`, property: descr }).save(),
        ]
      }).save();
    }

    for (let i = 0; i < 100; i++) {
      const parent = await Object.assign(new DirectoryEntity(), { id: `DIRECT_${i}` }).save();

      await Object.assign(new DirectoryStringEntity(), { string: `VALUE_${i}`, property: name, parent }).save();
      await Object.assign(new DirectoryStringEntity(), { string: `SECOND_${i}`, property: second, parent }).save();
      await Object.assign(new DirectoryStringEntity(), { string: `DESCRIPTION_${i}`, property: descr, parent }).save();
    }

    for (let i = 0; i < 1000; i++) {
      await Object.assign(new ValueEntity(), {
        id: `VALUE_${i}`,
        directory: `DIRECT_${Math.random() * 100 >> 0}`,
      }).save();
    }

    await Object.assign(new UserEntity(), {
      login: `USER_0`,
      string: [
        await Object.assign(new UserStringEntity(), { string: `VALUE_0`, property: name }).save(),
        await Object.assign(new UserStringEntity(), { string: `SECOND_0`, property: second }).save(),
        await Object.assign(new UserStringEntity(), { string: `DESCRIPTION_0`, property: descr }).save(),
      ],
      value: [
        await Object.assign(new UserValueEntity(), {
          value: `VALUE_${Math.random() * 100 >> 0}`,
          property: name
        }).save(),
        await Object.assign(new UserValueEntity(), {
          value: `VALUE_${Math.random() * 100 >> 0}`,
          property: second
        }).save(),
        await Object.assign(new UserValueEntity(), {
          value: `VALUE_${Math.random() * 100 >> 0}`,
          property: descr
        }).save(),
      ],
    }).save();

    const val_1 = await Object.assign(new PropertyEntity(), { id: 'VALUE+1' }).save();
    const val_2 = await Object.assign(new PropertyEntity(), { id: 'VALUE+2' }).save();
    const val_3 = await Object.assign(new PropertyEntity(), { id: 'VALUE+3' }).save();

    for (let i = 1; i < 1000; i++) {
      await Object.assign(new UserEntity(), {
        login: `USER_${i}`,
        string: [
          await Object.assign(new UserStringEntity(), { string: `VALUE_${i}`, property: name }).save(),
          await Object.assign(new UserStringEntity(), { string: `SECOND_${i}`, property: second }).save(),
          await Object.assign(new UserStringEntity(), { string: `DESCRIPTION_${i}`, property: descr }).save(),
        ],
        value: [
          await Object.assign(new UserValueEntity(), {
            value: `VALUE_${Math.random() * 100 >> 0}`,
            property: val_1
          }).save(),
          await Object.assign(new UserValueEntity(), {
            value: `VALUE_${Math.random() * 100 >> 0}`,
            property: val_2
          }).save(),
          await Object.assign(new UserValueEntity(), {
            value: `VALUE_${Math.random() * 100 >> 0}`,
            property: val_3
          }).save(),
        ],
        child: [
          await Object.assign(new UserUserEntity(), { user: (Math.random() * i >> 0) + 1, property: 'PARENT' }).save(),
          await Object.assign(new UserUserEntity(), { user: (Math.random() * i >> 0) + 1, property: 'PARENT' }).save(),
          await Object.assign(new UserUserEntity(), { user: (Math.random() * i >> 0) + 1, property: 'PARENT' }).save(),
        ]
      }).save();
    }

    const english = await Object.assign(new LangEntity(), { id: `EN` }).save();
    const german = await Object.assign(new LangEntity(), { id: `GR` }).save();

    for (let i = 0; i < 100; i++) {
      const parent = await Object.assign(new LangEntity(), { id: `LANG_${i}` }).save();

      await Object.assign(new LangStringEntity(), { string: `VALUE_EN_${i}`, property: name, parent, lang: english }).save();
      await Object.assign(new LangStringEntity(), { string: `SECOND_EN_${i}`, property: second, parent, lang: english }).save();
      await Object.assign(new LangStringEntity(), { string: `DESCRIPTION_EN_${i}`, property: descr, parent, lang: english }).save();

      await Object.assign(new LangStringEntity(), { string: `VALUE_GR_${i}`, property: name, parent, lang: german }).save();
      await Object.assign(new LangStringEntity(), { string: `SECOND_GR_${i}`, property: second, parent, lang: german }).save();
      await Object.assign(new LangStringEntity(), { string: `DESCRIPTION_GR_${i}`, property: descr, parent, lang: german }).save();
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