import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserPropertySchema } from "./user.property.schema";
import { PropertySchema } from "../../../property/schema/property.schema";

@ObjectType(
  'UserString',
  {
    implements: () => UserPropertySchema
  }
)
export class UserStringSchema {

  @Field(type => Int)
  id: number;

  @Field()
  string: string

  @Field(type => PropertySchema)
  property: PropertySchema

}