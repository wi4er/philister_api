import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DirectoryPropertyInput {
  @Field()
  property: string

  @Field()
  value: string
}

@InputType()
export class DirectoryInputSchema {
  @Field()
  id: string

  @Field(type => [ DirectoryPropertyInput ], { nullable: true })
  property: DirectoryPropertyInput[]
}