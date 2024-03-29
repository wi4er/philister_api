import { Field, ObjectType } from '@nestjs/graphql';
import { UserContactSchema } from './user-contact.schema';

@ObjectType('UserContactMutation')
export class UserContactMutationSchema {

  @Field(
    type => UserContactSchema,
    { description: 'Adding new user contact' },
  ) add: UserContactSchema;

  @Field(
    type => [ String ],
    { description: 'Deletion existent user contact' },
  ) delete: String[];

  @Field(
    type => UserContactSchema,
    { description: 'Updating existent user contact' },
  ) update: UserContactSchema;

  @Field(
    type => UserContactSchema,
    { description: 'Updating flag of user contact' },
  ) updateFlag: UserContactSchema;

}