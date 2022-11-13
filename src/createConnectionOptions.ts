import { UserEntity } from "./user/model/user.entity";
import { UserPropertyEntity } from "./user/model/user-property.entity";
import { PropertyEntity } from "./property/model/property.entity";
import { PropertyPropertyEntity } from "./property/model/property-property.entity";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";
import { DirectoryEntity } from "./directory/model/directory.entity";
import { DirectoryPropertyEntity } from "./directory/model/directory-property.entity";
import { UserGroupEntity } from "./user/model/user-group.entity";
import { ValueEntity } from "./directory/model/value.entity";

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
      UserEntity, UserGroupEntity, UserPropertyEntity,
      PropertyEntity, PropertyPropertyEntity,
      DirectoryEntity, DirectoryPropertyEntity, ValueEntity,
    ],
    subscribers: [],
    migrations: [],
  }
}