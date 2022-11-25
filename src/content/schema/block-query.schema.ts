import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ElementSchema } from "./element.schema";
import { BlockSchema } from "./block.schema";

@ObjectType('BlockQuery')
export class BlockQuerySchema {

  @Field(type => [ BlockSchema ])
  list: BlockSchema[];

  @Field(type => Int)
  count: number

  @Field(type => BlockSchema, { nullable: true })
  item: BlockSchema;

}