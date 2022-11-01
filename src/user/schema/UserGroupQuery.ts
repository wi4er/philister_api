import { Field, ObjectType } from "@nestjs/graphql";
import { UserGroup } from "./UserGroup";

@ObjectType()
export class UserGroupQuery {
  @Field(type => [UserGroup])
  list: [UserGroup]

  @Field(type => UserGroup)
  item: UserGroup
}