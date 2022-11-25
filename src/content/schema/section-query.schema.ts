import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ElementSchema } from "./element.schema";
import { SectionSchema } from "./section.schema";

@ObjectType(
  'SectionQuery'
)
export class SectionQuerySchema {

  @Field(type => [ SectionSchema ])
  list: SectionSchema[];

  @Field(type => Int)
  count: number

  @Field(type => SectionSchema, { nullable: true })
  item: SectionSchema;

}