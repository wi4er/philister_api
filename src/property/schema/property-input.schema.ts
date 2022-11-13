import { Field, InputType } from "@nestjs/graphql";


@InputType("PropertyPropertyInput")
export class PropertyPropertyInputSchema {
  @Field()
  property: string;

  @Field()
  value: string;
}

@InputType("PropertyInput")
export class PropertyInputSchema {
  @Field()
  id: string;

  @Field(type => [PropertyPropertyInputSchema], {nullable: true})
  property: PropertyPropertyInputSchema[];
}