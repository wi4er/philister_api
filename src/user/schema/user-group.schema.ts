import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('UserGroup')
export class UserGroupSchema {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;
}