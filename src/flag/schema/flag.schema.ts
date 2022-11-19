import { Field, ObjectType } from "@nestjs/graphql";
import { FlagFlagEntity } from "../model/flag-flag.entity";
import { FlagFlagSchema } from "./flag-flag.schema";
import { FlagPropertySchema } from "./flag-property.schema";

@ObjectType(
  'Flag'
)
export class FlagSchema {

  @Field()
  id: string;

  @Field()
  label: string

  @Field(type => [FlagPropertySchema])
  property: FlagPropertySchema[];

  @Field(type => [FlagFlagSchema])
  flag: FlagFlagEntity[];

}