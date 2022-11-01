import { ResolveField, Resolver } from '@nestjs/graphql';
import { User } from "../../schema/User";
import { UserQuery } from "../../schema/UserQuery";

@Resolver(of => UserQuery)
export class UserQueryResolver {

  @ResolveField("list", returns => [ User ])
  async list() {
    return [ { id: 10 }, { id: 20 }, { id: 30 } ];
  }

  @ResolveField("item", returns => [ User ])
  async item() {
    return { id: 22 };
  }
}
