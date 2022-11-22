import { Field, Int, ObjectType } from "@nestjs/graphql";
import { FlagSchema } from "../../flag/schema/flag.schema";

@ObjectType(
  'LangFlag'
)
export class LangFlagSchema {

  @Field(type => Int)
  id: number;

  @Field(type => FlagSchema)
  flag: FlagSchema;

}