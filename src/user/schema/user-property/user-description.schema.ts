import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserPropertySchema } from "./user.property.schema";

@ObjectType(
  'UserDescription',
  {
    implements: () => [UserPropertySchema]
  }
)
export class UserDescriptionSchema {

  @Field(type => Int)
  id: number;

  @Field()
  string: string;

}