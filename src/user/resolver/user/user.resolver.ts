import { Query, Resolver } from '@nestjs/graphql';
import { UserQuerySchema } from "../../schema/user-query.schema";
import { UserSchema } from "../../schema/user.schema";

@Resolver(of => UserSchema)
export class UserResolver {

}
