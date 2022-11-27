import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ChangeLogSchema } from './change-log.schema';

@ObjectType('ChangeLogQuery')
export class ChangeLogQuerySchema {

  @Field(type => [ ChangeLogSchema ])
  list: ChangeLogSchema[];

  @Field(type => Int)
  count: number;

  @Field(type => ChangeLogSchema, { nullable: true })
  item: ChangeLogSchema;

}