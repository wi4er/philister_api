import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { WithFlagInputSchema } from '../../../common/schema/with-flag.input.schema';
import {
  WithPropertyInputSchema,
  WithPropertyPropertyInputSchema,
} from '../../../common/schema/with-property-input.schema';

@InputType('UserGroupPropertyInput')
class UserGroupPropertyInputSchema implements WithPropertyPropertyInputSchema {

  @Field()
  @ApiProperty()
  property: string;

  @Field()
  @ApiProperty()
  string: string;

  @Field({ nullable: true })
  @ApiProperty()
  lang: string;

}

@InputType('UserGroupInput')
export class UserGroupInputSchema
  implements WithFlagInputSchema, WithPropertyInputSchema {

  @Field({ nullable: true })
  @ApiProperty()
  id?: number | null;

  @Field(type => Int, { nullable: true })
  parent: number | null;

  @Field(type => [ UserGroupPropertyInputSchema ])
  @ApiProperty({
    type: () => UserGroupPropertyInputSchema,
    description: 'User group property data list',
  })
  property: UserGroupPropertyInputSchema[];

  @Field(type => [ String ])
  @ApiProperty({ type: [ String ] })
  flag: string[];

}