import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PropertySchema } from './property.schema';

@ObjectType('PropertyQuery')
export class PropertyQuerySchema {

  @Field(type => [ PropertySchema ])
  list: PropertySchema[];

  @Field(type => Int)
  count: number;

  @Field(type => PropertySchema, { nullable: true })
  item: PropertySchema;

}