import { Field, InputType } from "@nestjs/graphql";

@InputType('LangPropertyInput')
export class LangPropertyInputSchema {

  @Field()
  property: string;

  @Field()
  string: string;

  @Field({ nullable: true })
  lang: string;

}

@InputType('LangInput')
export class LangInputSchema {

  @Field()
  id: string;

  @Field(
    type => [ LangPropertyInputSchema ],
    { nullable: true }
  )
  property: LangPropertyInputSchema[];

  @Field(
    type => [ String ],
    { nullable: true }
  )
  flag: string[];

}