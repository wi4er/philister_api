import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockMutationSchema } from '../../schema/block-mutation.schema';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { BlockInputSchema } from '../../schema/block-input.schema';
import { BlockInsertOperation } from '../../operation/block-insert.operation';
import { BlockUpdateOperation } from '../../operation/block-update.operation';
import { BlockDeleteOperation } from '../../operation/block-delete.operation';

@Resolver(of => BlockMutationSchema)
export class BlockMutationResolver {

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: BlockInputSchema,
  ) {
    return new BlockInsertOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: BlockInputSchema,
  ) {
    return new BlockUpdateOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ Int ] })
      id: number[],
  ): Promise<number[]> {
    return new BlockDeleteOperation(this.entityManager).save(id);
  }

}
