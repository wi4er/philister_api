import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ElementSchema } from "../../schema/element.schema";
import { ElementEntity } from "../../model/element.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlockEntity } from "../../model/block.entity";

@Resolver(of => ElementSchema)
export class ElementResolver {

  constructor(
    @InjectRepository(BlockEntity)
    private blockRepo: Repository<BlockEntity>,
  ) {
  }

  @ResolveField()
  created_at(
    @Parent()
      current: ElementEntity
  ) {
    return new Date(current.created_at).toISOString();
  }

  @ResolveField()
  updated_at(
    @Parent()
      current: ElementEntity
  ) {
    return new Date(current.updated_at).toISOString();
  }

  @ResolveField()
  async block(
    @Parent()
      current: { block: number }
  ): Promise<BlockEntity> {
    return this.blockRepo.findOne({
      where: { id: current.block },
      loadRelationIds: true,
    });
  }

}
