import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserUserSchema } from "../../schema/user-property/user-user.schema";
import { User2valueEntity } from "../../model/user2value.entity";
import { User2userEntity } from "../../model/user2user.entity";

@Resolver(of => UserUserSchema)
export class UserUserResolver {

  @ResolveField('string')
  async string(
    @Parent()
      value: User2userEntity
  ) {
    return 'NAME';
  }

  @ResolveField('property')
  async property(
    @Parent()
      value: User2userEntity
  ) {
    return value.property;
  }

}
