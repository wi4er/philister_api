import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserPropertySchema } from "./user-property/user.property.schema";
import { PropertySchema } from "../../property/schema/property.schema";
import { LangSchema } from "../../lang/schema/lang.schema";

@ObjectType('UserContactString', {
  implements: () => [ UserPropertySchema ]
})
export class UserContactStringSchema extends UserPropertySchema {

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

  @Field(type => LangSchema)
  lang: LangSchema;

}