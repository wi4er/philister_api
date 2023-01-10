import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserContactPropertySchema } from "./user-contact-property.schema";
import { PropertySchema } from "../../../property/schema/property.schema";
import { LangSchema } from "../../../lang/schema/lang.schema";

@ObjectType('UserContactString', {
  implements: () => [ UserContactPropertySchema ]
})
export class UserContactStringSchema extends UserContactPropertySchema {

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

  @Field(type => LangSchema, { nullable: true })
  lang: LangSchema;

}