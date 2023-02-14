import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockMutationSchema } from "../../schema/block-mutation.schema";
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { BlockInputSchema } from "../../schema/block-input.schema";
import { BlockEntity } from "../../model/block.entity";
import { Block2stringEntity } from "../../model/block2string.entity";
import { BlockInsertOperation } from '../../operation/block-insert.operation';

@Resolver(of => BlockMutationSchema)
export class BlockMutationResolver {

  constructor(
    @InjectRepository(BlockEntity)
    private blockRepo: Repository<BlockEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: BlockInputSchema
  ) {
   return new BlockInsertOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: BlockInputSchema
  ) {
    return null;
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ Int ] })
      id: number[]
  ): Promise<number[]> {
    const result = [];
    const list = await this.blockRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.blockRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
