import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { PropertySchema } from '../../property/schema/property.schema';
import { ContentPropertySchema } from './content-property.schema';

@InterfaceType(
  'SectionProperty',
  {
    resolveType: inst => {
      return 'SectionString';
    },
    implements: () => [ ContentPropertySchema ],
  },
)
export abstract class SectionPropertySchema implements ContentPropertySchema {

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

}
