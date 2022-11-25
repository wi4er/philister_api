import { Field, Int, ObjectType } from "@nestjs/graphql";
import { LangSchema } from "./lang.schema";

@ObjectType('LangQuery')
export class LangQuerySchema {

  @Field(type => [ LangSchema ])
  list: LangSchema[];

  @Field(type => Int)
  count: number;

  @Field(type => LangSchema, { nullable: true })
  item: LangSchema;

}