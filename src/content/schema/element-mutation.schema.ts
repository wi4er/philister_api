import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('ElementMutation')
export class ElementMutationSchema {

  @Field(
    type => ElementMutationSchema,
    { description: 'Adding new content element' }
  ) add: ElementMutationSchema;

  @Field(
    type => [ Int ],
    { description: 'Deletion existent content element' }
  ) delete: number[];

  @Field(
    type => ElementMutationSchema,
    { description: 'Updating existent content element' }
  ) update: ElementMutationSchema;

}