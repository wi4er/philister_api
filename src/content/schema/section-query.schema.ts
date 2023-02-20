import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SectionSchema } from './section.schema';

@ObjectType(
  'SectionQuery',
)
export class SectionQuerySchema {

  @Field(type => [ SectionSchema ])
  list: SectionSchema[];

  @Field(type => Int)
  count: number;

  @Field(type => SectionSchema, { nullable: true })
  item: SectionSchema | null;

}