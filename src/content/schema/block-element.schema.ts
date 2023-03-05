import { Field, ObjectType } from '@nestjs/graphql';
import { ElementSchema } from './element.schema';

@ObjectType('BlockElement')
export class BlockElementSchema {

  @Field()
  count: number;

  @Field(type => [ ElementSchema ])
  list: ElementSchema[];

}