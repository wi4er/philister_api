import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

export class WithPropertyPropertyInputSchema {

  @Field()
  property: string;

  @Field()
  string: string

  @Field({ nullable: true })
  lang: string;

}

export abstract class WithPropertyInputSchema {

  @Field(type => [ WithPropertyPropertyInputSchema ])
  property: WithPropertyPropertyInputSchema[];

}