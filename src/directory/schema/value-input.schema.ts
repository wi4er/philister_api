import { Field, InputType } from "@nestjs/graphql";

@InputType('ValuePropertyInput')
export class ValuePropertyInputSchema {
  @Field()
  property: string;

  @Field()
  value: string;
}

@InputType('ValueInput')
export class ValueInputSchema {
  @Field()
  id: string;

  @Field()
  directory: string

  @Field(type => [ ValuePropertyInputSchema ], { nullable: true })
  property: ValuePropertyInputSchema[];
}