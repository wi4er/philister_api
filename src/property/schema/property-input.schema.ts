import { Field, InputType } from '@nestjs/graphql';
import {
  WithPropertyInputSchema,
  WithPropertyPropertyInputSchema,
} from '../../common/schema/with-property-input.schema';
import { WithFlagInputSchema } from '../../common/schema/with-flag.input.schema';

@InputType('PropertyPropertyInput')
export class PropertyPropertyInputSchema implements WithPropertyPropertyInputSchema {

  @Field()
  property: string;

  @Field()
  string: string;

  @Field({ nullable: true })
  lang: string;

}

@InputType('PropertyInput')
export class PropertyInputSchema implements WithPropertyInputSchema, WithFlagInputSchema {

  @Field()
  id: string;

  @Field(type => [ PropertyPropertyInputSchema ], { nullable: false })
  property: PropertyPropertyInputSchema[];

  @Field(type => [ String ], { nullable: false })
  flag: string[];

}