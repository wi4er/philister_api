import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PropertySchema } from '../../property/schema/property.schema';
import { LangSchema } from '../../lang/schema/lang.schema';
import { SectionPropertySchema } from './section-property.schema';
import { ContentPropertySchema } from './content-property.schema';

@ObjectType(
  'SectionString',
  {
    implements: () => [ SectionPropertySchema, ContentPropertySchema ],
  },
)
export class SectionStringSchema implements SectionPropertySchema {

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