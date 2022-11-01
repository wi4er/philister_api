import { Query, Resolver } from '@nestjs/graphql';
import { UserQuery } from "../../schema/UserQuery";
import { User } from "../../schema/User";

@Resolver(of => User)
export class UserResolver {

}
