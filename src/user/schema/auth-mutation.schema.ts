import { Field, ObjectType } from '@nestjs/graphql';
import { UserSchema } from './user.schema';

@ObjectType('AuthMutation')
export class AuthMutationSchema {

  @Field(type => UserSchema, { nullable: true })
  authByLogin: UserSchema | null;


  @Field(type => UserSchema, { nullable: true })
  registerByLogin: UserSchema | null;

  @Field(type => UserSchema, { nullable: true })
  authByContact: UserSchema | null;

}