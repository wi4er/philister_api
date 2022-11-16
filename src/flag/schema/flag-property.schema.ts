import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "../../property/schema/property.schema";

@ObjectType(
  'FlagProperty'
)
export class FlagPropertySchema {

  @Field(type => Int)
  id: number;

  @Field()
  value: string;

  @Field(type => PropertySchema)
  property: PropertySchema;

}