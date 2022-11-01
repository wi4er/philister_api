import { Module } from '@nestjs/common';
import { UserQueryResolver } from './resolver/user-query/user-query.resolver';
import { UserResolver } from "./resolver/user/user.resolver";
import { UserRootResolver } from './resolver/user-root/user-root.resolver';
import { UserMutationResolver } from './resolver/user-mutation/user-mutation.resolver';
import { UserGroupResolver } from './resolver/user-group/user-group.resolver';
import { UserPropertyResolver } from './resolver/user-property/user-property.resolver';
import { UserPropertyQueryResolver } from './resolver/user-property-query/user-property-query.resolver';
import { UserPropertyMutationResolver } from './resolver/user-property-mutation/user-property-mutation.resolver';

@Module({
  providers: [UserRootResolver, UserQueryResolver, UserResolver, UserMutationResolver, UserGroupResolver, UserPropertyResolver, UserPropertyQueryResolver, UserPropertyMutationResolver]
})
export class UserModule {}
