import { ResolveField, Resolver } from '@nestjs/graphql';
import { BlockSectionSchema } from '../../schema/block-section.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockEntity } from '../../model/block.entity';
import { SectionEntity } from '../../model/section.entity';

@Resolver(of => BlockSectionSchema)
export class BlockSectionResolver {

  constructor(
    @InjectRepository(SectionEntity)
    private sectionRepo: Repository<SectionEntity>,
  ) {

  }

  @ResolveField()
  async count(
    current: BlockEntity,
  ): Promise<number> {
    return this.sectionRepo.count({
      where: { block: { id: current.id } },
    });
  }

  @ResolveField()
  async list(
    current: BlockEntity,
  ): Promise<SectionEntity[]> {
    return this.sectionRepo.find({
      where: { block: { id: current.id } },
      loadRelationIds: true,
    });
  }

}
