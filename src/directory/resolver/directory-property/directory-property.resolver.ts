import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryPropertySchema } from "../../schema/directory-property.schema";
import { PropertyEntity } from "../../../property/model/property.entity";
import { DirectoryEntity } from "../../model/directory.entity";

@Resolver(of => DirectoryPropertySchema)
export class DirectoryPropertyResolver {

  @ResolveField('property', type => PropertyEntity)
  async property(
    @Parent() directoryValue: DirectoryEntity
  ) {
    return directoryValue.property;
  }

}
