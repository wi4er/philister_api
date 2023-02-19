import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ElementSchema } from './element.schema';

@ObjectType('ElementMutation')
export class ElementMutationSchema {

  @Field(
    type => ElementSchema,
    { description: 'Adding new content element' }
  ) add: ElementSchema;

  @Field(
    type => [ Int ],
    { description: 'Deletion existent content element' }
  ) delete: number[];

  @Field(
    type => ElementSchema,
    { description: 'Updating existent content element' }
  ) update: ElementSchema;

}