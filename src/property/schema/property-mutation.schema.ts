import { Field, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "./property.schema";

@ObjectType('PropertyMutation')
export class PropertyMutationSchema {
  @Field(
    type => PropertySchema,
    { description: 'Adding new property' }
  ) add: PropertySchema

  @Field(
    type => [String],
    { description: 'Deletion existent property' }
  ) delete: String[]

  @Field(
    type => PropertySchema,
    { description: 'Updating existent property' }
  ) update: PropertySchema
}