import { Module } from '@nestjs/common';
import { UserRootResolver } from './resolver/user-root/user-root.resolver';
import { UserResolver } from "./resolver/user/user.resolver";
import { UserQueryResolver } from './resolver/user-query/user-query.resolver';
import { UserMutationResolver } from './resolver/user-mutation/user-mutation.resolver';
import { UserGroupResolver } from './resolver/user-group/user-group.resolver';
import { UserGroupMutationResolver } from './resolver/user-group-mutation/user-group-mutation.resolver';
import { UserGroupQueryResolver } from './resolver/user-group-query/user-group-query.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./model/User.entity";

@Module({
  imports: [ TypeOrmModule.forFeature([ UserEntity ]) ],
  providers: [
    UserRootResolver,
    UserResolver,
    UserQueryResolver,
    UserMutationResolver,
    UserGroupResolver,
    UserGroupQueryResolver,
    UserGroupMutationResolver,
  ]
})
export class UserModule {
}
