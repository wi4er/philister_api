import { ResolveField, Resolver } from '@nestjs/graphql';
import { BlockElementSchema } from '../../schema/block-element.schema';
import { ElementEntity } from '../../model/element.entity';
import { BlockEntity } from '../../model/block.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver(of => BlockElementSchema)
export class BlockElementResolver {

  constructor(
    @InjectRepository(ElementEntity)
    private elementRepo: Repository<ElementEntity>,
  ) {

  }

  @ResolveField()
  async count(
    current: BlockEntity,
  ): Promise<number> {
    return this.elementRepo.count({
      where: { block: { id: current.id } },
    });
  }

  @ResolveField()
  async list(
    current: BlockEntity,
  ): Promise<ElementEntity[]> {
    return this.elementRepo.find({
      where: { block: { id: current.id } },
      loadRelationIds: true,
    });
  }

}
