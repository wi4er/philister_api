import { Field, InputType } from '@nestjs/graphql';
import { WithFlagInputSchema } from '../../common/schema/with-flag.input.schema';
import { WithPropertyInputSchema } from '../../common/schema/with-property-input.schema';
import { ApiProperty } from '@nestjs/swagger';

@InputType('SectionInputProperty')
export class SectionInputPropertySchema {

  @Field()
  property: string;

  @Field()
  string: string;

  @Field({ nullable: true })
  @ApiProperty()
  lang: string;

}

@InputType('SectionInput')
export class SectionInputSchema implements WithFlagInputSchema, WithPropertyInputSchema {

  @Field({ nullable: true })
  id: number;

  @Field()
  block: number;

  @Field(of => [ SectionInputPropertySchema ])
  property: SectionInputPropertySchema[];

  @Field(of => [ String ])
  flag: string[];

}