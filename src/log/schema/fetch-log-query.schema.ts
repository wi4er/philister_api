import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FetchLogSchema } from './fetch-log.schema';

@ObjectType('FetchLogQuery')
export class FetchLogQuerySchema {

  @Field(type => [ FetchLogSchema ])
  list: FetchLogSchema[];

  @Field(type => Int)
  count: number;

  @Field(type => FetchLogSchema, { nullable: true })
  item: FetchLogSchema;

}