import { Field, Int, ObjectType } from "@nestjs/graphql";
import { FlagSchema } from "./flag.schema";

@ObjectType('FlagQuery')
export class FlagQuerySchema {

  @Field(type => [FlagSchema])
  list: [FlagSchema];

  @Field(type => Int)
  count: number;

  @Field(type => FlagSchema, {nullable: true})
  item: FlagSchema;

}