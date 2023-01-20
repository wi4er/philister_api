import { Field, ObjectType } from '@nestjs/graphql';
import { UserGroupSchema } from './user-group.schema';

@ObjectType('UserGroupMutation')
export class UserGroupMutationSchema {

  @Field(type => UserGroupSchema, { description: 'Adding new user group' })
  add: UserGroupSchema;

  @Field(type => UserGroupSchema)
  delete: UserGroupSchema;

  @Field(type => UserGroupSchema)
  update: UserGroupSchema;

}