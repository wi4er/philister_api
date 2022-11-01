import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserQuerySchema } from "../../schema/user-query.schema";
import { UserMutationSchema } from "../../schema/user-mutation.schema";
import { UserGroupQuerySchema } from "../../schema/user-group-query.schema";
import { UserGroupMutationSchema } from "../../schema/user-group-mutation.schema";

@Resolver()
export class UserRootResolver {

  @Query(returns => UserQuerySchema, {name: "user"})
  async getUser() {
    return {};
  }

  @Mutation(returns => UserMutationSchema, {name: "user"})
  async setUser() {
    return {}
  }

  @Query(returns => UserGroupQuerySchema, {name: "userGroup"})
  async geGroup() {
    return {};
  }

  @Mutation(returns => UserGroupMutationSchema, {name: "userGroup"})
  async setGroup() {
    return {}
  }

}
