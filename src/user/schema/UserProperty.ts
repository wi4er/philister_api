import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(type => Int)
  id: number;

  @Field({ nullable: true })
  login: string;

  @Field({ nullable: true })
  hash?: string;

  @Field(type => [User])
  group?: [User]
}