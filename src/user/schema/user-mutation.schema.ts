import { Field, ObjectType, } from "@nestjs/graphql";
import { UserSchema } from "./user.schema";

@ObjectType('UserMutation')
export class UserMutationSchema {
  @Field(type => UserSchema, { description: 'Adding new user' })
  add: UserSchema

  @Field(type => UserSchema, { description: 'Deletion existent user' })
  delete: UserSchema

  @Field(type => UserSchema, { description: 'Updating existent user' })
  update: UserSchema
}