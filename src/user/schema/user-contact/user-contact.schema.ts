import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserContactPropertySchema } from "./user-contact-property.schema";
import { FlagSchema } from "../../../flag/schema/flag.schema";

@ObjectType('UserContact')
export class UserContactSchema {

  @Field()
  id: string;

  @Field()
  type: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => [ UserContactPropertySchema ])
  propertyList: UserContactPropertySchema[];

  @Field(type => UserContactPropertySchema, { nullable: true })
  propertyItem: UserContactPropertySchema;

  @Field({ nullable: true })
  propertyString: string;

  @Field(type => [ FlagSchema ])
  flagList: FlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}