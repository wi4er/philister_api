import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlockSchema } from "./block.schema";

@ObjectType('Element')
export class ElementSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => BlockSchema)
  block: BlockSchema;
}