import { Field, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "./property.schema";

@ObjectType('PropertyMutation')
export class PropertyMutationSchema {
  @Field(
    type => PropertySchema,
    { description: 'Adding new property' }
  ) add: PropertySchema

  @Field(
    type => PropertySchema,
    { description: 'Deletion existent property' }
  ) delete: PropertySchema

  @Field(
    type => PropertySchema,
    { description: 'Updating existent property' }
  ) update: PropertySchema
}