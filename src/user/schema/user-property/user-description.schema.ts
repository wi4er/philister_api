import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserPropertySchema } from "./user-property.schema";
import { PropertySchema } from "../../../property/schema/property.schema";
import { LangSchema } from "../../../lang/schema/lang.schema";

@ObjectType(
  'UserDescription',
  {
    implements: () => [ UserPropertySchema ]
  }
)
export class UserDescriptionSchema extends UserPropertySchema {

  @Field(type => Int)
  id: number;

  @Field()
  string: string;

  @Field()
  description: string;

  @Field(type => PropertySchema)
  property: PropertySchema;

  @Field(type => LangSchema, { nullable: true })
  lang: LangSchema;

}