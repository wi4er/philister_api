import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ElementSchema } from "./element.schema";
import { SectionSchema } from "./section.schema";
import { ContentSchema } from "./content.schema";
import { ContentPropertySchema } from "./content-property.schema";

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
  section: SectionSchema[];

  @Field(type => [ ContentPropertySchema ])
  propertyList: ContentPropertySchema[];

  @Field(
    type => ContentPropertySchema,
    { nullable: true }
  )
  propertyItem: ContentPropertySchema;

  @Field({ nullable: true })
  propertyString: string;

}