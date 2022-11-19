import { Field, Int, InterfaceType } from "@nestjs/graphql";
import { UserStringEntity } from "../../model/user-string.entity";
import { PropertySchema } from "../../../property/schema/property.schema";
import { UserUserEntity } from "../../model/user-user.entity";
import { UserValueEntity } from "../../model/user-value.entity";
import { UserDescriptionEntity } from "../../model/user-description.entity";

@InterfaceType({
  resolveType(prop) {
    if (prop instanceof UserStringEntity) {
      return 'UserString';
    }

    if (prop instanceof UserUserEntity) {
      return 'UserUser';
    }

    if (prop instanceof UserValueEntity) {
      return 'UserValue';
    }

    if (prop instanceof UserDescriptionEntity) {
      return 'UserDescription';
    }

    return 'UserString';
  }
})
export abstract class UserPropertySchema {

  @Field(type => Int)
  id: number;

  @Field()
  string: string;

  @Field(type => PropertySchema)
  property: PropertySchema;

}