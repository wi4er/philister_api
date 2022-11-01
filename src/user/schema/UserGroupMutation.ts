import { Field, ObjectType,  } from "@nestjs/graphql";
import { UserGroup } from "./UserGroup";

@ObjectType()
export class UserGroupMutation {
  @Field(type => UserGroup, {description: "Adding new user group"})
  add: UserGroup

  @Field(type => UserGroup)
  delete: UserGroup

  @Field(type => UserGroup)
  update: UserGroup
}