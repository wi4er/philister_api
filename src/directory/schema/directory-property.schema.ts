import { Field, Int, InterfaceType } from "@nestjs/graphql";
import { PropertySchema } from "../../property/schema/property.schema";

@InterfaceType(
  'DirectoryProperty',
  {
    resolveType: inst => {
      return 'DirectoryString';
    }
  }
)
export abstract class DirectoryPropertySchema {

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