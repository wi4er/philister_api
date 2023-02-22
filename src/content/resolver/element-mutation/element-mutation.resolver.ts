import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { ElementMutationSchema } from '../../schema/element-mutation.schema';
import { ElementInputSchema } from '../../schema/element-input.schema';
import { ElementService } from '../../service/element/element.service';

@Resolver(of => ElementMutationSchema)
export class ElementMutationResolver {

  constructor(
    private elementService: ElementService,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: ElementInputSchema,
  ) {
    return this.elementService.insert(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: ElementInputSchema,
  ) {
    return this.elementService.update(item);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ Int ] })
      id: number[],
  ): Promise<number[]> {
    return this.elementService.delete(id);
  }

}
