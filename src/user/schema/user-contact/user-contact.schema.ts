import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserContactPropertySchema } from './user-contact-property.schema';
import { FlagSchema } from '../../../flag/schema/flag.schema';
import { UserContactType } from '../../model/user-contact.entity';
import { WithFlagSchema } from '../../../common/schema/with-flag.schema';
import { WithPropertySchema } from '../../../common/schema/with-property.schema';

@ObjectType('UserContact', {
  implements: () => [ WithFlagSchema ],
})
export class UserContactSchema implements WithFlagSchema, WithPropertySchema<UserContactPropertySchema> {

  @Field()
  id: string;

  @Field(type => UserContactType)
  type: UserContactType;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => [ UserContactPropertySchema ])
  propertyList: UserContactPropertySchema[];

  @Field(type => UserContactPropertySchema, { nullable: true })
  propertyItem: UserContactPropertySchema;

  @Field({ nullable: true })
  propertyString: string;

  @Field(type => [ FlagSchema ])
  flagList: FlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}