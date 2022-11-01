import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserQuery } from "../../schema/UserQuery";
import { UserMutation } from "../../schema/UserMutation";

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

}
