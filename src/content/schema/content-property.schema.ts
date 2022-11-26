import { Field, Int, InterfaceType } from "@nestjs/graphql";
import { PropertySchema } from "../../property/schema/property.schema";

@InterfaceType(
  'ContentProperty',
  {
    resolveType: inst => {
      return 'BlockString';
    }
  }
)
export abstract class ContentPropertySchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field()
  string: string;

  @Field(type => PropertySchema)
  property: PropertySchema;

}
