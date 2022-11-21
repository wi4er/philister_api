import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PropertyPropertySchema } from './property-property.schema';

@ObjectType('Property')
export class PropertySchema {

  @Field()
  id: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => [PropertyPropertySchema], {nullable: true})
  property: PropertyPropertySchema[];

}