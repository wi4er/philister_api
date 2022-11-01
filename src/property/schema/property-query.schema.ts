import { Field, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "./property.schema";

@ObjectType()
export class PropertyQuerySchema {

  @Field(type => [PropertySchema])
  list: [PropertySchema]

  @Field(type => PropertySchema)
  item: PropertySchema
}