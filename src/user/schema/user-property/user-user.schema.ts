import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserPropertySchema } from "./user-property.schema";
import { PropertySchema } from "../../../property/schema/property.schema";
import { UserSchema } from "../user.schema";

@ObjectType(
  'UserUser',
  {
    implements: () => [UserPropertySchema]
  }
)
export class UserUserSchema {

  @Field(type => Int)
  id: number;

  @Field()
  string: string;

  @Field(type => PropertySchema)
  property: PropertySchema;

  @Field(type => UserSchema)
  user: UserSchema;

}