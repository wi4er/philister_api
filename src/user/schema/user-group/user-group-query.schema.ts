import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserGroupSchema } from "./user-group.schema";

@ObjectType('UserGroupQuery')
export class UserGroupQuerySchema {

  @Field(type => [ UserGroupSchema ])
  list: [ UserGroupSchema ];

  @Field(type => UserGroupSchema)
  item: UserGroupSchema;

  @Field(type => Int)
  count: number;

}