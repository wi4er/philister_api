import { UserEntity } from "./user/model/user.entity";
import { UserPropertyEntity } from "./user/model/user-property.entity";
import { PropertyEntity } from "./property/model/property.entity";
import { PropertyPropertyEntity } from "./property/model/property-property.entity";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

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
    entities: [ UserEntity, UserPropertyEntity, PropertyEntity, PropertyPropertyEntity ],
    subscribers: [],
    migrations: [],
  }
}