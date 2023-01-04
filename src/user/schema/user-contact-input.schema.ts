import { Field, InputType, Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { UserContactType } from "../model/user-contact.entity";

@InputType('UserContactPropertyInput')
class UserContactPropertyInputSchema {

  @Field()
  @ApiProperty()
  property: string;

  @Field()
  @ApiProperty()
  string: string

}

@InputType('UserContactInput')
export class UserContactInputSchema {

  @Field({ nullable: true })
  @ApiProperty()
  id: string;

  @Field(type => UserContactType)
  @ApiProperty()
  type: UserContactType;

  @Field(returns => [ UserContactPropertyInputSchema ])
  @ApiProperty({
    type: () => UserContactPropertyInputSchema,
    description: 'User property data list',
  })
  property: UserContactPropertyInputSchema[];

  @Field(type => [ String ])
  @ApiProperty({ type: [ String ] })
  flag: string[];

}