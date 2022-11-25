import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { SectionEntity } from "../../model/section.entity";
import { SectionSchema } from "../../schema/section.schema";

@Resolver(of => SectionSchema)
export class SectionResolver {

  @ResolveField()
  created_at(
    @Parent()
      current: SectionEntity
  ) {
    return new Date(current.created_at).toISOString();
  }

  @ResolveField()
  updated_at(
    @Parent()
      current: SectionEntity
  ) {
    return new Date(current.updated_at).toISOString();
  }

}
