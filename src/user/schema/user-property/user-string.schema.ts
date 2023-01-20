import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserPropertySchema } from './user-property.schema';
import { PropertySchema } from '../../../property/schema/property.schema';
import { LangSchema } from '../../../lang/schema/lang.schema';

@ObjectType(
  'UserString',
  {
    implements: () => [ UserPropertySchema ],
  },
)
export class UserStringSchema extends UserPropertySchema {

  @Field(type => Int)
  id: number;

  @Field()
  string: string;

  @Field(type => PropertySchema)
  property: PropertySchema;

  @Field(type => LangSchema, { nullable: true })
  lang: LangSchema;

}