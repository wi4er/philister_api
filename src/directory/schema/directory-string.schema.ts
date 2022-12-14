import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PropertySchema } from "../../property/schema/property.schema";
import { DirectoryPropertySchema } from "./directory-property.schema";
import { LangSchema } from "../../lang/schema/lang.schema";

@ObjectType(
  'DirectoryString',
  {
    implements: () => [DirectoryPropertySchema]
  }
)
export class DirectoryStringSchema {

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