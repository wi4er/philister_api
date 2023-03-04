import { Field } from '@nestjs/graphql';

export class WithPropertyPropertyInputSchema {

  property: string;

  string: string;

  lang: string;

}

export abstract class WithPropertyInputSchema {

  @Field(type => [ WithPropertyPropertyInputSchema ])
  property: WithPropertyPropertyInputSchema[];

}