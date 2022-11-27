import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('FetchLog')
export class FetchLogSchema {

  @Field()
  id: number;

  @Field()
  entity: string;

  @Field()
  operation: string;

  @Field()
  arguments: string;

}