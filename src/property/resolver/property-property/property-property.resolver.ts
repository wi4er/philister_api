import { Resolver } from '@nestjs/graphql';
import { PropertyPropertySchema } from "../../schema/property-property.schema";

@Resolver(of => PropertyPropertySchema)
export class PropertyPropertyResolver {

}
