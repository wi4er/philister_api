import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "../../property/schema/property.schema";
import { LangPropertySchema } from "./lang-property.schema";
import { LangSchema } from "./lang.schema";

@ObjectType(
  'LangString',
  {
    implements: () => [ LangPropertySchema ]
  }
)
export class LangStringSchema {

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
  lang: LangSchema | null;

}