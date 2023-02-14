import { Field, Int, InterfaceType } from "@nestjs/graphql";
import { ContentPropertySchema } from "./content-property.schema";
import { LangFlagSchema } from "../../lang/schema/lang-flag.schema";
import { FlagSchema } from '../../flag/schema/flag.schema';

@InterfaceType(
  'Content',
  {}
)
export class ContentSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => [ ContentPropertySchema ])
  propertyList: ContentPropertySchema[];

  @Field(
    type => ContentPropertySchema,
    { nullable: true },
  )
  propertyItem: ContentPropertySchema;

  @Field(
    type => String,
    { nullable: true }
  )
  propertyString: string;

  @Field(type => [ FlagSchema ])
  flagList: FlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}