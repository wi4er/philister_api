import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockMutationSchema } from '../../schema/block-mutation.schema';
import { BlockInputSchema } from '../../schema/block-input.schema';
import { BlockService } from '../../service/block/block.service';

@Resolver(of => BlockMutationSchema)
export class BlockMutationResolver {

  constructor(
    private blockService: BlockService,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: BlockInputSchema,
  ) {
    return this.blockService.insert(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: BlockInputSchema,
  ) {
    return this.blockService.update(item);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ Int ] })
      id: number[],
  ): Promise<number[]> {
    return this.blockService.delete(id);
  }

}
