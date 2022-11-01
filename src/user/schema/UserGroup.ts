import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserGroup {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;
}