import { Field, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "../../property/schema/property.schema";

@ObjectType('DirectoryProperty')
export class DirectoryPropertySchema {

  @Field()
  id: string

  @Field()
  value: string

  @Field(type => PropertySchema)
  property: PropertySchema
}