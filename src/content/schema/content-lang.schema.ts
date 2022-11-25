import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FlagSchema } from '../../flag/schema/flag.schema';

@ObjectType('ContentFlag')
export class ContentFlagSchema {

  @Field(type => Int)
  id: number;

  @Field(type => FlagSchema)
  flag: FlagSchema;

}