import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { WithFlagInputSchema } from "../../common/schema/with-flag.input.schema";
import { WithPropertySchema } from "../../common/schema/with-property.schema";
import { UserSchema } from "./user.schema";
import { UserPropertySchema } from "./user-property/user-property.schema";
import { FlagSchema } from "../../flag/schema/flag.schema";
import { WithPropertyInputSchema } from "../../common/schema/with-property-input.schema";

@InputType('UserUserContactInput')
class UserContactInputSchema {

  @Field()
  @ApiProperty()
  contact: string

  @Field()
  @ApiProperty()
  value: string;

}

@InputType('UserPropertyInput')
class UserPropertyInputSchema {

  @Field()
  @ApiProperty()
  property: string;

  @Field()
  @ApiProperty()
  string: string

  @Field({ nullable: true })
  @ApiProperty()
  lang: string;

}

@InputType('UserInput')
export class UserInputSchema implements WithFlagInputSchema, WithPropertyInputSchema {

  @Field(returns => Int, { nullable: true })
  @ApiProperty()
  id: number;

  @Field()
  @ApiProperty()
  login: string;

  @Field(returns => [ UserContactInputSchema ])
  @ApiProperty({
    type: () => UserContactInputSchema,
    description: 'User contact data list',
  })
  contact: UserContactInputSchema[];

  @Field(returns => [ UserPropertyInputSchema ])
  @ApiProperty({
    type: () => UserPropertyInputSchema,
    description: 'User property data list',
  })
  property: UserPropertyInputSchema[];

  @Field(type => [ String ])
  @ApiProperty({ type: [ String ] })
  flag: string[];

}