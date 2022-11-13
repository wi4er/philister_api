import { Field, ObjectType } from "@nestjs/graphql";
import { ValueSchema } from "./value.schema";

@ObjectType('ValueMutation', {
  description: ''
})
export class ValueMutationSchema {
  @Field(
    type => ValueSchema,
    { description: 'Adding new value' }
  ) add: ValueSchema;

  @Field(
    type => [String],
    { description: 'Deletion existent value' }
  ) delete: String[];

  @Field(
    type => ValueSchema,
    { description: 'Updating existent value' }
  ) update: ValueSchema;
}