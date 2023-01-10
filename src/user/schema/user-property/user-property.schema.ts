import { Field, Int, InterfaceType } from "@nestjs/graphql";
import { User2stringEntity } from "../../model/user2string.entity";
import { PropertySchema } from "../../../property/schema/property.schema";
import { User2userEntity } from "../../model/user2user.entity";
import { User2valueEntity } from "../../model/user2value.entity";
import { User2descriptionEntity } from "../../model/user2description.entity";

@InterfaceType('UserProperty', {
  resolveType(prop) {
    if (prop instanceof User2stringEntity) {
      return 'UserString';
    }

    if (prop instanceof User2userEntity) {
      return 'UserUser';
    }

    if (prop instanceof User2valueEntity) {
      return 'UserValue';
    }

    if (prop instanceof User2descriptionEntity) {
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