import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { PropertySchema } from '../../property/schema/property.schema';
import { BlockEntity } from '../model/block.entity';
import { ElementEntity } from '../model/element.entity';
import { Block2stringEntity } from '../model/block2string.entity';
import { Element2stringEntity } from '../model/element2string.entity';

@InterfaceType(
  'ContentProperty',
  {
    resolveType: inst => {
      if (inst instanceof Block2stringEntity) {
        return 'BlockString';
      }

      if (inst instanceof Element2stringEntity) {
        return 'ElementString';
      }

      return 'BlockString';
    },
  },
)
export abstract class ContentPropertySchema {

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
