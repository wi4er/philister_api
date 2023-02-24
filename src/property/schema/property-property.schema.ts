import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { PropertySchema } from './property.schema';

@InterfaceType(
  'PropertyProperty',
  {
    resolveType: inst => {
      return 'PropertyString';
    },
  },
)
export class PropertyPropertySchema {

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