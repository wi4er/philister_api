import { Field, InputType } from "@nestjs/graphql";

@InputType('FlagPropertyInput')
export class FlagPropertyInputSchema {

  @Field()
  property: string;

  @Field()
  string: string;

  @Field({ nullable: true })
  lang: string;

}

@InputType('FlagInput')
export class FlagInputSchema {

  @Field()
  id: string;

  @Field(
    type => [ FlagPropertyInputSchema ],
    { nullable: false }
  )
  property: FlagPropertyInputSchema[];

  @Field(
    type => [ String ],
    { nullable: false }
  )
  flag: string[];

}