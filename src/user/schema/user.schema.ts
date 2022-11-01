import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserGroupMutationSchema } from "./user-group-mutation.schema";
import { UserPropertySchema } from "./user-property.schema";

@ObjectType('User')
export class UserSchema {
  @Field(type => Int)
  id: number;

  @Field({ nullable: true })
  login: string;

  @Field({ nullable: true })
  hash?: string;

  @Field(type => [UserSchema])
  group?: [UserGroupMutationSchema]

  @Field(type => [UserPropertySchema])
  property?: [UserPropertySchema]
}