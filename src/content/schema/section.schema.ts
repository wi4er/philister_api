import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Section')
export class SectionSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

}