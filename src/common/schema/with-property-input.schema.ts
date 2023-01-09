import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

export class WithPropertyPropertyInputSchema {

  property: string;

  string: string

  lang: string;

}

export abstract class WithPropertyInputSchema {

  @Field(type => [ WithPropertyPropertyInputSchema ])
  property: WithPropertyPropertyInputSchema[];

}