import { Field, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "../../property/schema/property.schema";
import { FlagSchema } from "./flag.schema";

@ObjectType(
  'FlagMutation'
)
export class FlagMutationSchema {
  @Field(
    type => FlagSchema,
    { description: 'Adding new flag' }
  ) add: FlagSchema

  @Field(
    type => [ String ],
    { description: 'Deletion existent flag' }
  ) delete: String[]

  @Field(
    type => FlagSchema,
    { description: 'Updating existent flag' }
  ) update: FlagSchema
}