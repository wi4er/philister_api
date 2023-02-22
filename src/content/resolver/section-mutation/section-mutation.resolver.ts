import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { SectionInputSchema } from '../../schema/section-input.schema';
import { SectionMutationSchema } from '../../schema/section-mutation.schema';
import { SectionService } from '../../service/section/section.service';

@Resolver(of => SectionMutationSchema)
export class SectionMutationResolver {

  constructor(
    private sectionService: SectionService
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: SectionInputSchema,
  ) {
    return this.sectionService.insert(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: SectionInputSchema,
  ) {
    return this.sectionService.update(item);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ Int ] })
      id: number[],
  ): Promise<number[]> {
    return this.sectionService.delete(id);
  }

}
