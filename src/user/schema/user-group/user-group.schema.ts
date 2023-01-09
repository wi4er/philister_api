import { Field, Int, ObjectType } from '@nestjs/graphql';
import { WithFlagSchema } from "../../../common/schema/with-flag.schema";
import { FlagSchema } from "../../../flag/schema/flag.schema";
import { UserGroupPropertySchema } from "./user-group-property.schema";

@ObjectType('UserGroup', {
  implements: () => [ WithFlagSchema ]
})
export class UserGroupSchema implements WithFlagSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => UserGroupSchema, { nullable: true })
  parent: UserGroupSchema;

  @Field(type => [UserGroupSchema])
  children: UserGroupSchema[]

  @Field(type => [ UserGroupPropertySchema ])
  propertyList: UserGroupPropertySchema[];

  @Field(type => UserGroupPropertySchema, { nullable: true })
  propertyItem: UserGroupPropertySchema;

  @Field({ nullable: true })
  propertyString: string;

  @Field(type => [ FlagSchema ])
  flagList: FlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}