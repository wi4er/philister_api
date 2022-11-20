import { Field, Int, ObjectType } from "@nestjs/graphql";
import { DirectorySchema } from "./directory.schema";
import { ValuePropertySchema } from "./value-property.schema";

@ObjectType(
  'Value'
)
export class ValueSchema {

  @Field()
  id: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => DirectorySchema)
  directory: DirectorySchema;

  @Field(type => [ ValuePropertySchema ])
  propertyList: ValuePropertySchema[];

  @Field(type =>  ValuePropertySchema )
  propertyItem: ValuePropertySchema;

  @Field()
  propertyString: string;
}