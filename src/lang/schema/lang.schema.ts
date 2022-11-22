import { Field, Int, ObjectType } from "@nestjs/graphql";
import { LangPropertySchema } from "./lang-property.schema";
import { LangFlagSchema } from "./lang-flag.schema";

@ObjectType(
  'Lang'
)
export class LangSchema {

  @Field()
  id: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => [ LangPropertySchema ])
  propertyList: LangPropertySchema[];

  @Field(type => LangPropertySchema, { nullable: true })
  propertyItem: LangPropertySchema;

  @Field({ nullable: true })
  propertyString: string;

  @Field(type => [ LangFlagSchema ])
  flagList: LangFlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}