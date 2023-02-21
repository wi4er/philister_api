import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FlagSchema } from '../../flag/schema/flag.schema';
import { BlockSchema } from './block.schema';
import { SectionPropertySchema } from './section-property.schema';

@ObjectType('Section')
export class SectionSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => BlockSchema)
  block: BlockSchema;

  @Field(type => SectionSchema, { nullable: true })
  parent: SectionSchema | null;

  @Field(type => [ SectionPropertySchema ])
  propertyList: SectionPropertySchema[];

  @Field(
    type => SectionPropertySchema,
    { nullable: true },
  )
  propertyItem: SectionPropertySchema;

  @Field({ nullable: true })
  propertyString: string;

  @Field(type => [ FlagSchema ])
  flagList: FlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}