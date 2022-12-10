import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockMutationSchema } from "../../schema/block-mutation.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlockInputSchema } from "../../schema/block-input.schema";
import { BlockEntity } from "../../model/block.entity";
import { BlockStringEntity } from "../../model/block-string.entity";

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
          new BlockStringEntity(),
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
}
