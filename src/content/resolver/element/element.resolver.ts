import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ElementSchema } from '../../schema/element.schema';
import { ElementEntity } from '../../model/element.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockEntity } from '../../model/block.entity';
import { Element2stringEntity } from '../../model/element2string.entity';
import { Element2flagEntity } from '../../model/element2flag.entity';

@Resolver(of => ElementSchema)
export class ElementResolver {

  constructor(
    @InjectRepository(BlockEntity)
    private blockRepo: Repository<BlockEntity>,
    @InjectRepository(Element2stringEntity)
    private stringRepo: Repository<Element2stringEntity>,
    @InjectRepository(Element2flagEntity)
    private flagRepo: Repository<Element2flagEntity>,
  ) {
  }

  @ResolveField()
  created_at(
    @Parent()
      current: ElementEntity,
  ) {
    return new Date(current.created_at).toISOString();
  }

  @ResolveField()
  updated_at(
    @Parent()
      current: ElementEntity,
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
