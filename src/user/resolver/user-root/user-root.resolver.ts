import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserQuery } from "../../schema/UserQuery";
import { UserMutation } from "../../schema/UserMutation";
import { UserGroupQuery } from "../../schema/UserGroupQuery";
import { UserGroupMutation } from "../../schema/UserGroupMutation";

@Resolver()
export class UserRootResolver {

  @Query(returns => UserQuery, {name: "user"})
  async getUser() {
    return {};
  }

  @Mutation(returns => UserMutation, {name: "user"})
  async setUser() {
    return {}
  }

  @Query(returns => UserGroupQuery, {name: "userGroup"})
  async geGroup() {
    return {};
  }

  @Mutation(returns => UserGroupMutation, {name: "userGroup"})
  async setGroup() {
    return {}
  }

}
