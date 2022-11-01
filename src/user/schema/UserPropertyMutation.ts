import { Field, ObjectType,  } from "@nestjs/graphql";
import { User } from "./User";

@ObjectType()
export class UserMutation {
  @Field(type => User, {description: "Adding new user"})
  add: User

  @Field(type => User)
  delete: User

  @Field(type => User)
  update: User
}