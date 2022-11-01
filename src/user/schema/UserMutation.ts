import { Field, ObjectType,  } from "@nestjs/graphql";
import { User } from "./User";

@ObjectType()
export class UserMutation {
  @Field(type => User, {description: "Adding new user"})
  add: User

  @Field(type => User, {description: "Deletion existent user"})
  delete: User

  @Field(type => User, {description: "Updating existent user"})
  update: User
}