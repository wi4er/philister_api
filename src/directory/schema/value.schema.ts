import { Field, ObjectType } from "@nestjs/graphql";
import { DirectorySchema } from "./directory.schema";

@ObjectType(
  'Value'
)
export class ValueSchema {

  @Field()
  id: string;

  @Field(type => DirectorySchema)
  directory: DirectorySchema;

}