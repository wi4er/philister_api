import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserSchema } from "../../user/schema/user.schema";

@ObjectType('ChangeLog')
export class ChangeLogSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: Date;

  @Field()
  entity: string;

  @Field()
  entityId: string;

  @Field()
  field: string;

  @Field()
  value: string;

  @Field(type => UserSchema)
  user: UserSchema;

}