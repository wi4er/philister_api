import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PropertySchema } from "./property.schema";

@ObjectType("PropertyProperty")
export class PropertyPropertySchema {
  @Field()
  id: string;

  @Field()
  value: string

  @Field(type => PropertySchema)
  property: PropertySchema
}