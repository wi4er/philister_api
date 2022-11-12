import { Field, ObjectType } from "@nestjs/graphql";
import { DirectoryPropertySchema } from "./directory-property.schema";

@ObjectType('Directory')
export class DirectorySchema {

  @Field()
  id: string

  @Field(type => [DirectoryPropertySchema], {nullable: true})
  property: DirectoryPropertySchema[];

}