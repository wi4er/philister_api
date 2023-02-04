import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockMutationSchema } from "../../schema/block-mutation.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from 'typeorm';
import { BlockInputSchema } from "../../schema/block-input.schema";
import { BlockEntity } from "../../model/block.entity";
import { Block2stringEntity } from "../../model/block2string.entity";

@Resolver(of => BlockMutationSchema)
export class BlockMutationResolver {

  constructor(
    @InjectRepository(BlockEntity)
    private blockRepo: Repository<BlockEntity>,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: BlockInputSchema
  ) {
    const inst = new BlockEntity();
    const parent = await inst.save();

    if (item.property) {
      for (const value of item.property) {
        await Object.assign(
          new Block2stringEntity(),
          {
            string: value.string,
            property: value.property,
            parent,
          }
        ).save();
      }
    }

    await inst.reload();

    return inst;
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
