import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('ChangeLog')
export class ChangeLogSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: Date;

  @Field()
  entity: string;

  @Field()
  field: string;

  @Field()
  value: string;

}