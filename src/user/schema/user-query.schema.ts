import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserSchema } from "./user.schema";

@ObjectType('UserQuery')
export class UserQuerySchema {

  @Field(type => [UserSchema])
  list: [UserSchema];

  @Field(type => Int)
  count: number;

  @Field(type => UserSchema, {nullable: true})
  item: UserSchema;

  @Field(type => UserSchema, {nullable: true})
  myself: UserSchema;

}