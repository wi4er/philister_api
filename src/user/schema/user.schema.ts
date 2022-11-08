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

  @Field(type => [ UserSchema ], { nullable: true })
  group?: [ UserGroupMutationSchema ]

  @Field(type => [ UserPropertySchema ], { nullable: true })
  property?: [ UserPropertySchema ]
}