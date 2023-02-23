import { Field, InputType } from '@nestjs/graphql';
import {
  WithPropertyInputSchema,
  WithPropertyPropertyInputSchema,
} from '../../common/schema/with-property-input.schema';
import { WithFlagInputSchema } from '../../common/schema/with-flag.input.schema';

@InputType('ValuePropertyInput')
export class ValuePropertyInputSchema implements WithPropertyPropertyInputSchema {

  @Field()
  property: string;

  @Field()
  string: string;

  @Field({ nullable: true })
  lang: string | null;

}

@InputType('ValueInput')
export class ValueInputSchema implements WithPropertyInputSchema, WithFlagInputSchema {

  @Field()
  id: string;

  @Field()
  directory: string;

  @Field(type => [ ValuePropertyInputSchema ], { nullable: false })
  property: ValuePropertyInputSchema[];

  @Field(type => [ String ], { nullable: false })
  flag: string[];

}