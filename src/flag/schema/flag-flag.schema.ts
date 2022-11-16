import { Field, ObjectType } from "@nestjs/graphql";
import { FlagSchema } from "./flag.schema";

@ObjectType(
  'FlagFlag'
)
export class FlagFlagSchema {

  @Field()
  id: number;

  @Field(type => FlagSchema)
  flag: FlagSchema;

}