import { Field, ObjectType } from '@nestjs/graphql';
import { UserSchema } from "./user.schema";

@ObjectType('UserQuery')
export class UserQuerySchema {
  @Field(type => [UserSchema])
  list: [UserSchema]

  @Field(type => UserSchema)
  item: UserSchema
}