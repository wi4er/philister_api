import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./User";

@ObjectType()
export class UserQuery {
  @Field(type => [User])
  list: [User]

  @Field(type => User)
  item: User
}