import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockSchema } from "../../schema/block.schema";
import { BlockEntity } from "../../model/block.entity";
import { ElementEntity } from "../../model/element.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SectionEntity } from "../../model/section.entity";

@Resolver(of => BlockSchema)
export class BlockResolver {

  constructor(
    @InjectRepository(ElementEntity)
    private elementRepo: Repository<ElementEntity>,

    @InjectRepository(SectionEntity)
    private sectionRepo: Repository<SectionEntity>,
  ) {
  }

  @ResolveField()
  created_at(
    @Parent()
      current: BlockEntity
  ) {
    return new Date(current.created_at).toISOString();
  }

  @ResolveField()
  updated_at(
    @Parent()
      current: BlockEntity
  ) {
    return new Date(current.updated_at).toISOString();
  }

  @ResolveField()
  async element(
    @Parent()
      current: BlockEntity
  ): Promise<ElementEntity[]> {
    return this.elementRepo.find({
      where: { block: { id: current.id } },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async section(
    @Parent()
      current: BlockEntity
  ): Promise<SectionEntity[]> {
    return this.sectionRepo.find({
      where: { block: { id: current.id } },
      loadRelationIds: true,
    });
  }

}
