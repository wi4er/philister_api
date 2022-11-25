import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ElementSchema } from "./element.schema";

@ObjectType('ElementQuery')
export class ElementQuerySchema {

  @Field(type => [ ElementSchema ])
  list: ElementSchema[];

  @Field(type => Int)
  count: number

  @Field(type => ElementSchema, { nullable: true })
  item: ElementSchema;

}