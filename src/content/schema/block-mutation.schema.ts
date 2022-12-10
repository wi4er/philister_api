import { Field, ObjectType } from "@nestjs/graphql";
import { BlockSchema } from "./block.schema";

@ObjectType('BlockMutation')
export class BlockMutationSchema {

  @Field(
    type => BlockSchema,
    { description: 'Adding new content block' }
  ) add: BlockSchema;

  @Field(
    type => [ String ],
    { description: 'Deletion existent content block' }
  ) delete: String[];

  @Field(
    type => BlockSchema,
    { description: 'Updating existent content block' }
  ) update: BlockSchema;

}