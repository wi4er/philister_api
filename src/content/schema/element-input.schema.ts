import { Field, InputType } from '@nestjs/graphql';
import { WithFlagInputSchema } from '../../common/schema/with-flag.input.schema';
import { WithPropertyInputSchema } from '../../common/schema/with-property-input.schema';
import { ApiProperty } from '@nestjs/swagger';

@InputType('ElementInputProperty')
export class ElementInputPropertySchema {

  @Field()
  property: string;

  @Field()
  string: string;

  @Field({ nullable: true })
  @ApiProperty()
  lang: string;

}

@InputType('ElementInput')
export class ElementInputSchema implements WithFlagInputSchema, WithPropertyInputSchema {

  @Field({ nullable: true })
  id: number;

  @Field()
  block: number;

  @Field(of => [ ElementInputPropertySchema ])
  property: ElementInputPropertySchema[];

  @Field(of => [ String ])
  flag: string[];

}