import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserGroupMutationSchema } from "./user-group-mutation.schema";
import { PropertySchema } from "../../property/schema/property.schema";

@ObjectType('UserProperty')
export class UserPropertySchema {
  @Field(type => Int)
  id: number;

  @Field()
  value: string

  @Field(type => PropertySchema)
  property: PropertySchema
}