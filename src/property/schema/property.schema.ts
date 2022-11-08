import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PropertyPropertySchema } from "./property-property.schema";

@ObjectType("Property")
export class PropertySchema {
  @Field()
  id: string;

  @Field(type => [PropertyPropertySchema], {nullable: true})
  property: PropertyPropertySchema[];
}