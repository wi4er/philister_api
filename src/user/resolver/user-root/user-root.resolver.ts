import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserQuerySchema } from '../../schema/user-query.schema';
import { UserMutationSchema } from '../../schema/user-mutation.schema';
import { AuthMutationSchema } from '../../schema/auth-mutation.schema';
import { UserContactQuerySchema } from "../../schema/user-contact/user-contact-query.schema";
import { UserContactMutationSchema } from "../../schema/user-contact/user-contact-mutation.schema";
import { UserGroupQuerySchema } from "../../schema/user-group/user-group-query.schema";
import { UserGroupMutationSchema } from "../../schema/user-group/user-group-mutation.schema";

@Resolver()
export class UserRootResolver {

  @Query(returns => UserQuerySchema, { name: 'user' })
  async getUser() {
    return {};
  }

  @Mutation(returns => UserMutationSchema, { name: 'user' })
  async setUser() {
    return {}
  }

  @Mutation(returns => AuthMutationSchema, { name: 'auth', nullable: true })
  async setAuth() {
    return {}
  }

  @Query(returns => UserGroupQuerySchema, { name: 'userGroup' })
  async geGroup() {
    return {};
  }

  @Mutation(returns => UserGroupMutationSchema, { name: 'userGroup' })
  async setGroup() {
    return {};
  }

  @Query(returns => UserContactQuerySchema, { name: 'userContact' })
  async getContact() {
    return {};
  }

  @Mutation(returns => UserContactMutationSchema, { name: 'userContact' })
  async setContact() {
    return {}
  }

}
