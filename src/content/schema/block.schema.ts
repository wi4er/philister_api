import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ElementSchema } from "./element.schema";
import { SectionSchema } from "./section.schema";
import { ContentSchema } from "./content.schema";

@ObjectType(
  'Block',
  {
    implements: () => [ ContentSchema ]
  }
)
export class BlockSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => [ ElementSchema ])
  element: ElementSchema[];

  @Field(type => [ SectionSchema ])
  section: SectionSchema[]

}