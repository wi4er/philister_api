import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ElementSchema } from './element.schema';

@ObjectType('ElementMutation')
export class ElementMutationSchema {

  @Field(
    type => ElementSchema,
    { description: 'Adding new content element' },
  ) add: ElementSchema;

  @Field(
    type => [ Int ],
    { description: 'Deletion existent content element' },
  ) delete: number[];

  @Field(
    type => ElementSchema,
    {
      description: `
        Updating existing content element with new data. All previous data will be lost and replaced with new. 
      `,
    },
  ) update: ElementSchema;

  @Field(
    type => ElementSchema,
    {
      description: `
        Updating existing content element flags. New content flag will be added, existent flag will be removed. 
      `,
    },
  )
  toggleFlag: ElementSchema;

}