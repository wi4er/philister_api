import { Module } from '@nestjs/common';
import { UserRootResolver } from './resolver/user-root/user-root.resolver';
import { UserResolver } from "./resolver/user/user.resolver";
import { UserQueryResolver } from './resolver/user-query/user-query.resolver';
import { UserMutationResolver } from './resolver/user-mutation/user-mutation.resolver';
import { UserGroupResolver } from './resolver/user-group/user-group.resolver';
import { UserGroupMutationResolver } from './resolver/user-group-mutation/user-group-mutation.resolver';
import { UserGroupQueryResolver } from './resolver/user-group-query/user-group-query.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./model/user.entity";
import { UserStringResolver } from './resolver/user-string/user-string.resolver';
import { UserStringEntity } from "./model/user-string.entity";
import { PropertyEntity } from "../property/model/property.entity";
import { AuthMutationResolver } from './resolver/auth-mutation/auth-mutation.resolver';
import { UserService } from './service/user/user.service';
import { EncodeService } from "./service/encode/encode.service";
import { PropertyPropertyEntity } from "../property/model/property-property.entity";
import { UserValueResolver } from './resolver/user-value/user-value.resolver';
import { UserUserResolver } from './resolver/user-user/user-user.resolver';
import { UserUserEntity } from "./model/user-user.entity";
import { UserValueEntity } from "./model/user-value.entity";
import { UserFlagEntity } from "./model/user-flag.entity";
import { UserController } from './controller/user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity, UserStringEntity, UserUserEntity, UserValueEntity, UserFlagEntity,
      PropertyEntity, PropertyPropertyEntity
    ])
  ],
  providers: [
    UserRootResolver,
    UserResolver,
    UserQueryResolver,
    UserMutationResolver,
    UserGroupResolver,
    UserGroupQueryResolver,
    UserGroupMutationResolver,
    UserStringResolver,
    AuthMutationResolver,
    EncodeService,
    UserService,
    UserValueResolver,
    UserUserResolver,
  ],
  controllers: [UserController]
})
export class UserModule {
}
