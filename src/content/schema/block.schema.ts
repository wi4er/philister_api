import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SectionSchema } from "./section.schema";
import { ContentSchema } from "./content.schema";
import { FlagSchema } from '../../flag/schema/flag.schema';
import { BlockPropertySchema } from './block-property.schema';
import { BlockElementSchema } from './block-element.schema';
import { BlockSectionSchema } from './block-section.schema';

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

  @Field(type => BlockElementSchema)
  element: BlockElementSchema[];

  @Field(type => BlockSectionSchema)
  section: BlockSectionSchema[];

  @Field(type => [ BlockPropertySchema ])
  propertyList: BlockPropertySchema[];

  @Field(
    type => BlockPropertySchema,
    { nullable: true }
  )
  propertyItem: BlockPropertySchema | null;

  @Field({ nullable: true })
  propertyString: string;

  @Field(type => [ FlagSchema ])
  flagList: FlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}