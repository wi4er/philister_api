import { Field, ObjectType } from "@nestjs/graphql";
import { DirectoryPropertySchema } from "./directory-property.schema";
import { ValueSchema } from "./value.schema";

@ObjectType('Directory')
export class DirectorySchema {

  @Field()
  id: string;

  @Field(type => [DirectoryPropertySchema], {nullable: true})
  property: DirectoryPropertySchema[];

  @Field(type => [ValueSchema], {nullable: true})
  value: ValueSchema[];

}