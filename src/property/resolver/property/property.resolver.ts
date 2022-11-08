import { ResolveField, Resolver } from '@nestjs/graphql';
import { PropertySchema } from "../../schema/property.schema";

@Resolver(of => PropertySchema)
export class PropertyResolver {

  @ResolveField("property", type => PropertySchema)
  async property() {

  }
}
