import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PropertyPropertySchema } from './property-property.schema';
import { FlagSchema } from '../../flag/schema/flag.schema';
import { WithPropertySchema } from '../../common/schema/with-property.schema';
import { WithFlagSchema } from '../../common/schema/with-flag.schema';

@ObjectType('Property')
export class PropertySchema
  implements WithPropertySchema<PropertyPropertySchema>, WithFlagSchema{

  @Field()
  id: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => [ PropertyPropertySchema ])
  propertyList: PropertyPropertySchema[];

  @Field(
    type => PropertyPropertySchema,
    { nullable: true }
  )
  propertyItem: PropertyPropertySchema;

  @Field({ nullable: true })
  propertyString: string;

  @Field(type => [ FlagSchema ])
  flagList: FlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}