import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockQuerySchema } from "../../schema/block-query.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlockEntity } from "../../model/block.entity";

@Resolver(of => BlockQuerySchema)
export class BlockQueryResolver {

  constructor(
    @InjectRepository(BlockEntity)
    private blockRepo: Repository<BlockEntity>,
  ) {
  }

  @ResolveField('list')
  async list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.blockRepo.find({
      skip: offset,
      take: limit,
      loadRelationIds: true,
    });
  }

  @ResolveField('count')
  async count(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.blockRepo.count({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField('item')
  item(
    @Args('id', { type: () => Int })
      id: number
  ) {
    return this.blockRepo.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }
}
