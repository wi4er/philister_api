import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlockSchema } from "./block.schema";
import { ContentPropertySchema } from './content-property.schema';
import { FlagSchema } from '../../flag/schema/flag.schema';
import { ElementPropertySchema } from './element-property.schema';

@ObjectType('Element')
export class ElementSchema {

  @Field(type => Int)
  id: number;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field(type => Int)
  version: number;

  @Field(type => BlockSchema)
  block: BlockSchema;

  @Field(type => [ ElementPropertySchema ])
  propertyList: ElementPropertySchema[];

  @Field(
    type => ElementPropertySchema,
    { nullable: true }
  )
  propertyItem: ElementPropertySchema;

  @Field({ nullable: true })
  propertyString: string;

  @Field(type => [ FlagSchema ])
  flagList: FlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}