import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "../../property/schema/property.schema";
import { FlagPropertySchema } from "./flag-property.schema";

@ObjectType(
  'FlagString',
  {
    implements: () => [FlagPropertySchema]
  }
)
export class FlagStringSchema {

  @Field(type => Int)
  id: number;

  @Field()
  value: string;

  @Field(type => PropertySchema)
  property: PropertySchema;

}