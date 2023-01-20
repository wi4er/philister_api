import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserSchema } from './user.schema';

@ObjectType('UserMutation')
export class UserMutationSchema {

  @Field(type => UserSchema, { description: 'Adding new user' })
  add: UserSchema;

  @Field(type => [ Int ], { description: 'Deletion existent user' })
  delete: number[];

  @Field(type => UserSchema, { description: 'Updating existent user' })
  update: UserSchema;

  @Field(
    type => UserSchema,
    { description: 'Updating flag of user' },
  ) updateFlag: UserSchema;

}