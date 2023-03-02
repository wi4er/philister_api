import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SectionSchema } from './section.schema';

@ObjectType('SectionMutation')
export class SectionMutationSchema {

  @Field(
    type => SectionSchema,
    { description: 'Adding new content section' }
  ) add: SectionSchema;

  @Field(
    type => [ Int ],
    { description: 'Deletion existent content section' }
  ) delete: number[];

  @Field(
    type => SectionSchema,
    { description: 'Updating existent content section' }
  ) update: SectionSchema;

  @Field(
    type => SectionSchema,
    {
      description: `
        Updating existing content section flags. New content flag will be added, existent flag will be removed. 
      `,
    },
  )
  toggleFlag: SectionSchema;

}