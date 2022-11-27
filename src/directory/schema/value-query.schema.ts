import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ValueSchema } from "./value.schema";

@ObjectType('ValueQuery')
export class ValueQuerySchema {

  @Field(type => [ ValueSchema ])
  list: ValueSchema [];

  @Field(type => Int)
  count: number;

  @Field(type => ValueSchema, { nullable: true })
  item: ValueSchema;

}
