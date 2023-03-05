import { Field, ObjectType } from '@nestjs/graphql';
import { SectionSchema } from './section.schema';

@ObjectType('BlockSection')
export class BlockSectionSchema {

  @Field()
  count: number;

  @Field(type => [ SectionSchema ])
  list: SectionSchema[];

}