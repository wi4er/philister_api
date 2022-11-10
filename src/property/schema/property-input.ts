import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class PropertyPropertyInput {
  @Field()
  property: string

  @Field()
  value: string
}

@InputType()
export class PropertyInput {
  @Field()
  id: string

  @Field(type => [PropertyPropertyInput], {nullable: true})
  property: PropertyPropertyInput[]
}