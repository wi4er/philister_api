import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

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

}

@InputType('UserInput')
export class UserInputSchema {

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

}