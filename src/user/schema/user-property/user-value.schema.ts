import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserPropertySchema } from "./user-property.schema";
import { PropertySchema } from "../../../property/schema/property.schema";
import { DirectorySchema } from "../../../directory/schema/directory.schema";
import { ValueSchema } from "../../../directory/schema/value.schema";

@ObjectType(
  'UserValue',
  {
    implements: () => UserPropertySchema
  }
)
export class UserValueSchema {

  @Field(type => Int)
  id: number;

  @Field()
  string: string;

  @Field(type => PropertySchema)
  property: PropertySchema;

  @Field(type => DirectorySchema)
  directory: DirectorySchema;

  @Field(type => ValueSchema)
  value: ValueSchema;

}