import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserContactSchema } from "./user-contact.schema";

@ObjectType('UserUserContact')
export class UserUserContactSchema {

  @Field(type => Int)
  id: number;

  @Field()
  value: string;

  @Field(type => UserContactSchema)
  contact: UserContactSchema;

}