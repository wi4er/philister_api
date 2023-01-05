import { UserEntity } from "./user/model/user.entity";
import { User2stringEntity } from "./user/model/user2string.entity";
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
import { User2flagEntity } from "./user/model/user2flag.entity";
import { User2valueEntity } from "./user/model/user2value.entity";
import { User2userEntity } from "./user/model/user2user.entity";
import { PropertyUserEntity } from "./property/model/property-user.entity";
import { User2descriptionEntity } from "./user/model/user2description.entity";
import { ValueStringEntity } from "./directory/model/value.string.entity";
import { LangEntity } from "./lang/model/lang.entity";
import { LangStringEntity } from "./lang/model/lang-string.entity";
import { LangFlagEntity } from "./lang/model/lang-flag.entity";
import { ElementEntity } from "./content/model/element.entity";
import { ElementSectionEntity } from "./content/model/element-section.entity";
import { SectionEntity } from "./content/model/section.entity";
import { ElementStringEntity } from "./content/model/element-string.entity";
import { BlockEntity } from "./content/model/block.entity";
import { BlockStringEntity } from "./content/model/block-string.entity";
import { ElementValueEntity } from "./content/model/element-value.entity";
import { SectionValueEntity } from "./content/model/section-value.entity";
import { SectionStringEntity } from "./content/model/section-string.entity";
import { ElementElementEntity } from "./content/model/element-element.entity";
import { ChangeLogEntity } from "./log/model/change-log.entity";
import { FetchLogEntity } from "./log/model/fetch-log.entity";
import { DirectoryFlagEntity } from "./directory/model/directory-flag.entity";
import { ValueFlagEntity } from "./directory/model/value-flag.entity";
import { UserContactEntity } from "./user/model/user-contact.entity";
import { User2userContactEntity } from "./user/model/user2user-contact.entity";
import { UserContact2flagEntity } from "./user/model/user-contact2flag.entity";
import { UserContact2stringEntity } from "./user/model/user-contact2string.entity";

export function createConnectionOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'example',
    database: 'postgres',
    synchronize: true,
    // logging: true,
    entities: [
      UserEntity, User2stringEntity, User2flagEntity, User2valueEntity, User2userEntity, User2descriptionEntity,
      User2userContactEntity,
      UserContactEntity, UserContact2stringEntity, UserContact2flagEntity,
      UserGroupEntity,
      PropertyEntity, PropertyPropertyEntity, PropertyUserEntity,
      DirectoryEntity, DirectoryStringEntity, DirectoryFlagEntity,
      ValueEntity, ValueStringEntity, ValueFlagEntity,
      FlagEntity, FlagStringEntity, FlagFlagEntity,
      LangEntity, LangStringEntity, LangFlagEntity,
      ElementEntity, ElementSectionEntity, ElementStringEntity, ElementValueEntity, ElementElementEntity,
      SectionEntity, SectionValueEntity, SectionStringEntity,
      BlockEntity, BlockStringEntity,
      ChangeLogEntity, FetchLogEntity,
    ],
    subscribers: [],
    migrations: [],
  }
}