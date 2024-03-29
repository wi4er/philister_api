import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PropertySchema } from '../../property/schema/property.schema';
import { ContentPropertySchema } from './content-property.schema';
import { LangSchema } from '../../lang/schema/lang.schema';
import { BlockPropertySchema } from './block-property.schema';

@ObjectType(
  'BlockString',
  {
    implements: () => [ BlockPropertySchema, ContentPropertySchema ],
  },
)
export class BlockStringSchema implements BlockPropertySchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field()
  string: string;

  @Field(type => PropertySchema)
  property: PropertySchema;

  @Field(type => LangSchema, { nullable: true })
  lang: LangSchema | null;

}