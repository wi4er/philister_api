import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlockSchema } from "./block.schema";

@ObjectType('BlockMutation')
export class BlockMutationSchema {

  @Field(
    type => BlockSchema,
    { description: 'Adding new content block' }
  ) add: BlockSchema;

  @Field(
    type => [ Int ],
    { description: 'Deletion existent content block' }
  ) delete: number[];

  @Field(
    type => BlockSchema,
    { description: 'Updating existent content block' }
  ) update: BlockSchema;

}