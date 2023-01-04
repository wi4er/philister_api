import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserContactSchema } from "./user-contact.schema";

@ObjectType('UserContactQuery')
export class UserContactQuerySchema {

  @Field(type => [ UserContactSchema ])
  list: UserContactSchema[];

  @Field(type => Int)
  count: number;

  @Field(type => UserContactSchema, { nullable: true })
  item: UserContactSchema;

}