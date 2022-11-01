import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType("Property")
export class PropertySchema {
  @Field()
  id: string;
}