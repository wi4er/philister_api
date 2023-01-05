import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('UserGroup')
export class UserGroupSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

}