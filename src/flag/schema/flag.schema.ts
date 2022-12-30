import { Field, Int, ObjectType } from "@nestjs/graphql";
import { FlagFlagSchema } from "./flag-flag.schema";
import { FlagPropertySchema } from "./flag-property.schema";

@ObjectType('Flag')
export class FlagSchema {

  @Field()
  id: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field({ nullable: true })
  label: string | null;

  @Field(type => [ FlagPropertySchema ])
  propertyList: FlagPropertySchema[];

  @Field(type => FlagPropertySchema, { nullable: true })
  propertyItem: FlagPropertySchema;

  @Field({ nullable: true })
  propertyString: string;

  @Field(type => [ FlagFlagSchema ])
  flagList: FlagFlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}