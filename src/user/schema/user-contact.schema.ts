import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ContactSchema } from "./contact.schema";

@ObjectType('UserContact')
export class UserContactSchema {

  @Field(type => Int)
  id: number;

  @Field()
  value: string;

  @Field(type => ContactSchema)
  contact: ContactSchema;

}