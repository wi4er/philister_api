import { UserEntity } from "./user/model/user.entity";
import { User2stringEntity } from "./user/model/user2string.entity";
import { PropertyEntity } from "./property/model/property.entity";
import { PropertyPropertyEntity } from "./property/model/property-property.entity";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";
import { DirectoryEntity } from "./directory/model/directory.entity";
import { Directory2stringEntity } from "./directory/model/directory2string.entity";
import { UserGroupEntity } from "./user/model/user-group.entity";
import { ValueEntity } from "./directory/model/value.entity";
import { FlagEntity } from "./flag/model/flag.entity";
import { FlagFlagEntity } from "./flag/model/flag-flag.entity";
import { FlagStringEntity } from "./flag/model/flag-string.entity";
import { User2flagEntity } from "./user/model/user2flag.entity";
import { User2valueEntity } from "./user/model/user2value.entity";
import { User2userEntity } from "./user/model/user2user.entity";
import { PropertyUserEntity } from "./property/model/property-user.entity";
import { User2descriptionEntity } from "./user/model/user2description.entity";
import { Value2stringEntity } from "./directory/model/value2string.entity";
import { LangEntity } from "./lang/model/lang.entity";
import { LangStringEntity } from "./lang/model/lang-string.entity";
import { LangFlagEntity } from "./lang/model/lang-flag.entity";
import { ElementEntity } from "./content/model/element.entity";
import { Element2sectionEntity } from "./content/model/element2section.entity";
import { SectionEntity } from "./content/model/section.entity";
import { Element2stringEntity } from "./content/model/element2string.entity";
import { BlockEntity } from "./content/model/block.entity";
import { Block2stringEntity } from "./content/model/block2string.entity";
import { Element2valueEntity } from "./content/model/element2value.entity";
import { Section2valueEntity } from "./content/model/section2value.entity";
import { Section2stringEntity } from "./content/model/section2string.entity";
import { Element2elementEntity } from "./content/model/element2element.entity";
import { ChangeLogEntity } from "./log/model/change-log.entity";
import { FetchLogEntity } from "./log/model/fetch-log.entity";
import { Directory2flagEntity } from "./directory/model/directory2flag.entity";
import { Value2flagEntity } from "./directory/model/value2flag.entity";
import { UserContactEntity } from "./user/model/user-contact.entity";
import { User2userContactEntity } from "./user/model/user2user-contact.entity";
import { UserContact2flagEntity } from "./user/model/user-contact2flag.entity";
import { UserContact2stringEntity } from "./user/model/user-contact2string.entity";
import { UserGroup2stringEntity } from "./user/model/user-group2string.entity";
import { UserGroup2flagEntity } from "./user/model/user-group2flag.entity";
import { User2userGroupEntity } from "./user/model/user2user-group.entity";
import { Element2flagEntity } from './content/model/element2flag.entity';
import { Section2flagEntity } from './content/model/section2flag.entity';
import { Block2flagEntity } from './content/model/block2flag.entity';

export function createConnectionOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USER_NAME || 'postgres',
    password: process.env.DB_USER_PASSWORD || 'example',
    database: process.env.DB_DATABASE || 'postgres',
    synchronize: true,
    // logging: true,
    entities: [
      UserEntity, User2stringEntity, User2flagEntity, User2valueEntity, User2userEntity, User2descriptionEntity,
      User2userContactEntity, User2userGroupEntity,
      UserContactEntity, UserContact2stringEntity, UserContact2flagEntity,
      UserGroupEntity, UserGroup2stringEntity, UserGroup2flagEntity,
      PropertyEntity, PropertyPropertyEntity, PropertyUserEntity,
      DirectoryEntity, Directory2stringEntity, Directory2flagEntity,
      ValueEntity, Value2stringEntity, Value2flagEntity,
      FlagEntity, FlagStringEntity, FlagFlagEntity,
      LangEntity, LangStringEntity, LangFlagEntity,
      ElementEntity, Element2sectionEntity, Element2stringEntity, Element2valueEntity, Element2elementEntity, Element2flagEntity,
      SectionEntity, Section2valueEntity, Section2stringEntity, Section2flagEntity,
      BlockEntity, Block2stringEntity, Block2flagEntity,
      ChangeLogEntity, FetchLogEntity,
    ],
    subscribers: [],
    migrations: [],
  }
}