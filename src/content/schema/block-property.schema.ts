import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { PropertySchema } from '../../property/schema/property.schema';
import { ContentPropertySchema } from './content-property.schema';

@InterfaceType(
  'BlockProperty',
  {
    resolveType: inst => {
      return 'BlockString';
    },
    implements: () => [ ContentPropertySchema ],
  },
)
export class BlockPropertySchema {

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