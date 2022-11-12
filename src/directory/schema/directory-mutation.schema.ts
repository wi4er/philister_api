import { Field, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "../../property/schema/property.schema";
import { DirectorySchema } from "./directory.schema";

@ObjectType('DirectoryMutation', {
  description: ''
})
export class DirectoryMutationSchema {
  @Field(
    type => DirectorySchema,
    { description: 'Adding new directory' }
  ) add: PropertySchema

  @Field(
    type => [String],
    { description: 'Deletion existent directory' }
  ) delete: String[]

  @Field(
    type => DirectorySchema,
    { description: 'Updating existent directory' }
  ) update: PropertySchema
}