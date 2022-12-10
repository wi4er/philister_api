import { Field, Int, ObjectType } from "@nestjs/graphql";
import { DirectoryStringSchema } from "./directory-string.schema";
import { ValueSchema } from "./value.schema";
import { LangFlagSchema } from "../../lang/schema/lang-flag.schema";

@ObjectType('Directory')
export class DirectorySchema {

  @Field()
  id: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => [ DirectoryStringSchema ], { nullable: true })
  property: DirectoryStringSchema[];

  @Field(type => [ ValueSchema ], { nullable: true })
  value: ValueSchema[];

  @Field(type => [ LangFlagSchema ])
  flagList: LangFlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}