import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { SectionEntity } from "../../model/section.entity";
import { SectionSchema } from "../../schema/section.schema";
import { BlockEntity } from '../../model/block.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section2stringEntity } from '../../model/section2string.entity';
import { Section2flagEntity } from '../../model/section2flag.entity';

@Resolver(of => SectionSchema)
export class SectionResolver {

  constructor(
    @InjectRepository(BlockEntity)
    private blockRepo: Repository<BlockEntity>,
    @InjectRepository(Section2stringEntity)
    private stringRepo: Repository<Section2stringEntity>,
    @InjectRepository(Section2flagEntity)
    private flagRepo: Repository<Section2flagEntity>,
  ) {
  }

  @ResolveField()
  created_at(
    @Parent()
      current: SectionEntity
  ) {
    return new Date(current.created_at).toISOString();
  }

  @ResolveField()
  updated_at(
    @Parent()
      current: SectionEntity
  ) {
    return new Date(current.updated_at).toISOString();
  }


  @ResolveField()
  async block(
    @Parent()
      current: { block: number },
  ): Promise<BlockEntity> {
    return this.blockRepo.findOne({
      where: { id: current.block },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async propertyList(
    @Parent()
      current: BlockEntity,
  ) {
    return this.stringRepo.find({
      where: { parent: { id: current.id } },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async propertyItem(
    @Args('id')
      id: string,
    @Parent()
      current: BlockEntity,
  ) {
    return this.stringRepo.findOne({
      where: {
        property: { id },
        parent: { id: current.id },
      },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async propertyString(
    @Args('id')
      id: string,
    @Parent()
      current: BlockEntity,
  ) {
    return this.stringRepo.findOne({
      where: {
        property: { id },
        parent: { id: current.id },
      },
    }).then(item => item?.string);
  }

  @ResolveField()
  async flagList(
    @Parent()
      current: { id: number },
  ) {
    return this.flagRepo.find({
      where: {
        parent: { id: current.id },
      },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async flagString(
    @Parent()
      current: { id: number },
  ) {
    return this.flagRepo.find({
      where: {
        parent: { id: current.id },
      },
      loadRelationIds: true,
    }).then(list => list.map(item => item?.flag ?? ''));
  }

}
