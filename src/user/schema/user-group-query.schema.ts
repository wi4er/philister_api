import { Field, ObjectType } from "@nestjs/graphql";
import { UserGroupSchema } from "./user-group.schema";

@ObjectType('UserGroupQuery')
export class UserGroupQuerySchema {
  @Field(type => [UserGroupSchema])
  list: [UserGroupSchema]

  @Field(type => UserGroupSchema)
  item: UserGroupSchema
}