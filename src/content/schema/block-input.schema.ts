import { Field, InputType } from '@nestjs/graphql';
import { WithFlagInputSchema } from '../../common/schema/with-flag.input.schema';
import { WithPropertyInputSchema } from '../../common/schema/with-property-input.schema';
import { ApiProperty } from '@nestjs/swagger';

@InputType('BlockPropertyInput')
export class BlockPropertyInputSchema {

  @Field()
  property: string;

  @Field()
  string: string;

  @Field({ nullable: true })
  @ApiProperty()
  lang: string;

}

@InputType('BlockInput')
export class BlockInputSchema implements WithFlagInputSchema, WithPropertyInputSchema {

  @Field({ nullable: true })
  id: number;

  @Field(of => [ BlockPropertyInputSchema ])
  property: BlockPropertyInputSchema[];

  @Field(of => [ String ])
  flag: string[];

}