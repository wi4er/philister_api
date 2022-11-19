import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserUserSchema } from "../../schema/user-property/user-user.schema";
import { UserValueEntity } from "../../model/user-value.entity";
import { UserUserEntity } from "../../model/user-user.entity";

@Resolver(of => UserUserSchema)
export class UserUserResolver {

  @ResolveField('string')
  async string(
    @Parent()
      value: UserUserEntity
  ) {
    return 'NAME';
  }

  @ResolveField('property')
  async property(
    @Parent()
      value: UserUserEntity
  ) {
    return value.property;
  }

}
