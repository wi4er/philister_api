import { UserEntity } from "./user/model/user.entity";
import { UserStringEntity } from "./user/model/user-string.entity";
import { PropertyEntity } from "./property/model/property.entity";
import { PropertyPropertyEntity } from "./property/model/property-property.entity";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";
import { DirectoryEntity } from "./directory/model/directory.entity";
import { DirectoryStringEntity } from "./directory/model/directory-string.entity";
import { UserGroupEntity } from "./user/model/user-group.entity";
import { ValueEntity } from "./directory/model/value.entity";
import { FlagEntity } from "./flag/model/flag.entity";
import { FlagFlagEntity } from "./flag/model/flag-flag.entity";
import { FlagStringEntity } from "./flag/model/flag-string.entity";
import { UserFlagEntity } from "./user/model/user-flag.entity";
import { UserValueEntity } from "./user/model/user-value.entity";
import { UserUserEntity } from "./user/model/user-user.entity";
import { PropertyUserEntity } from "./property/model/property-user.entity";
import { UserDescriptionEntity } from "./user/model/user-description.entity";
import { ValueStringEntity } from "./directory/model/value.string.entity";
import { LangEntity } from "./lang/model/lang.entity";
import { LangStringEntity } from "./lang/model/lang-string.entity";
import { LangFlagEntity } from "./lang/model/lang-flag.entity";

export function createConnectionOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'example',
    database: 'postgres',
    synchronize: true,
    // logging: true,
    entities: [
      UserEntity, UserStringEntity, UserFlagEntity, UserValueEntity, UserUserEntity, UserDescriptionEntity,
      UserGroupEntity,
      PropertyEntity, PropertyPropertyEntity, PropertyUserEntity,
      DirectoryEntity, DirectoryStringEntity, ValueEntity, ValueStringEntity,
      FlagEntity, FlagStringEntity, FlagFlagEntity,
      LangEntity, LangStringEntity, LangFlagEntity,
    ],
    subscribers: [],
    migrations: [],
  }
}