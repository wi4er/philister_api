import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertyPropertySchema } from "../../schema/property-property.schema";
import { PropertyEntity } from "../../model/property.entity";

@Resolver(of => PropertyPropertySchema)
export class PropertyPropertyResolver {

  @ResolveField()
  async property(
    @Parent() propertyValue: PropertyEntity
  ) {
    return propertyValue.property;
  }
}
