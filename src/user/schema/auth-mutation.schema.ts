import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserSchema } from "./user.schema";

@ObjectType('AuthMutation')
export class AuthMutationSchema {

  @Field(type => UserSchema)
  authByPassword?: UserSchema;

}