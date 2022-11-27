import { Field, ObjectType } from '@nestjs/graphql';
import { UserSchema } from "../../user/schema/user.schema";

@ObjectType('FetchLog')
export class FetchLogSchema {

  @Field()
  id: number;

  @Field()
  entity: string;

  @Field()
  entityId: string;

  @Field()
  operation: string;

  @Field()
  arguments: string;

  @Field(type => UserSchema)
  user: UserSchema;

}
