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
import { UserPropertyResolver } from './resolver/user-property/user-property.resolver';
import { UserPropertyEntity } from "./model/user-property.entity";
import { PropertyEntity } from "../property/model/property.entity";
import { AuthMutationResolver } from './resolver/auth-mutation/auth-mutation.resolver';
import { UserService } from './service/user/user.service';
import { EncodeService } from "./service/encode/encode.service";
import { PropertyPropertyEntity } from "../property/model/property-property.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ UserEntity, UserPropertyEntity, PropertyEntity, PropertyPropertyEntity ])
  ],
  providers: [
    UserRootResolver,
    UserResolver,
    UserQueryResolver,
    UserMutationResolver,
    UserGroupResolver,
    UserGroupQueryResolver,
    UserGroupMutationResolver,
    UserPropertyResolver,
    AuthMutationResolver,
    EncodeService,
    UserService,
  ]
})
export class UserModule {
}
