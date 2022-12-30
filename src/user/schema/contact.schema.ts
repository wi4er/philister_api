import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType('Contact')
export class ContactSchema {

  @Field()
  id: string


}