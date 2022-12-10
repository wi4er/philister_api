import { Field, InputType } from "@nestjs/graphql";

@InputType('BlockPropertyInput')
export class BlockPropertyInputSchema {

  @Field()
  property: string;

  @Field()
  string: string;

}

@InputType('BlockInput')
export class BlockInputSchema {

  @Field({ nullable: true })
  id: number;

  @Field(
    of => [ BlockPropertyInputSchema ],
    { nullable: true },
  )
  property: BlockPropertyInputSchema[];

}