import { Field, ObjectType } from "@nestjs/graphql";
import { FlagFlagSchema } from "./flag-flag.schema";
import { FlagPropertySchema } from "./flag-property.schema";

@ObjectType('Flag')
export class FlagSchema {

  @Field()
  id: string;

  @Field({ nullable: true })
  label: string

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