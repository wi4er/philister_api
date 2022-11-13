import { Field, ObjectType } from "@nestjs/graphql";
import { DirectorySchema } from "./directory.schema";

@ObjectType('DirectoryMutation', {
  description: ''
})
export class DirectoryMutationSchema {
  @Field(
    type => DirectorySchema,
    { description: 'Adding new directory' }
  ) add: DirectorySchema;

  @Field(
    type => [String],
    { description: 'Deletion existent directory' }
  ) delete: String[];

  @Field(
    type => DirectorySchema,
    { description: 'Updating existent directory' }
  ) update: DirectorySchema;
}