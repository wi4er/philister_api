import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserPropertySchema } from './user-property/user-property.schema';
import { FlagSchema } from '../../flag/schema/flag.schema';
import { UserUserContactSchema } from './user-user-contact.schema';
import { UserGroupSchema } from './user-group/user-group.schema';
import { WithFlagSchema } from '../../common/schema/with-flag.schema';

@ObjectType('User', {
  implements: () => [ WithFlagSchema ],
})
export class UserSchema implements WithFlagSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field()
  login: string;

  @Field({ nullable: true })
  hash?: string;

  @Field(type => [ UserUserContactSchema ])
  contact: UserUserContactSchema[];

  @Field(type => [ UserGroupSchema ], { nullable: true })
  group?: UserGroupSchema[];

  @Field(type => [ UserPropertySchema ])
  propertyList: UserPropertySchema[];

  @Field(type => UserPropertySchema, { nullable: true })
  propertyItem: UserPropertySchema;

  @Field({ nullable: true })
  propertyString: string;

  @Field(type => [ FlagSchema ])
  flagList: FlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}