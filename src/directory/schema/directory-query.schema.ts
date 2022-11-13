import { Field, Int, ObjectType } from "@nestjs/graphql";
import { DirectorySchema } from "./directory.schema";

@ObjectType('DirectoryQuery')
export class DirectoryQuerySchema {

  @Field(type => [DirectorySchema])
  list: [DirectorySchema];

  @Field(type => Int)
  count: number;

  @Field(type => DirectorySchema, {nullable: true})
  item: DirectorySchema;

}
