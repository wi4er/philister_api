import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "../../property/schema/property.schema";
import { BlockPropertySchema } from "./block-property.schema";

@ObjectType(
  'ValueString',
  {
    implements: () => [BlockPropertySchema]
  }
)
export class BlockStringSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field()
  string: string;

  @Field(type => PropertySchema)
  property: PropertySchema;

}