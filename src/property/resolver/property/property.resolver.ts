import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertySchema } from '../../schema/property.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyEntity } from '../../model/property.entity';
import { Property2stringEntity } from '../../model/property2string.entity';
import { Property2flagEntity } from '../../model/property2flag.entity';

@Resolver(of => PropertySchema)
export class PropertyResolver {

  constructor(
    @InjectRepository(Property2stringEntity)
    private stringRepo: Repository<Property2stringEntity>,
    @InjectRepository(Property2flagEntity)
    private flagRepo: Repository<Property2flagEntity>,
  ) {
  }

  @ResolveField()
  created_at(
    @Parent()
      current: PropertyEntity,
  ) {
    return new Date(current.created_at).toISOString();
  }

  @ResolveField()
  updated_at(
    @Parent()
      current: PropertyEntity,
  ) {
    return new Date(current.updated_at).toISOString();
  }

  @ResolveField()
  async propertyList(
    @Parent()
      current: PropertyEntity,
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
      current: PropertyEntity,
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
      current: PropertyEntity,
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
      current: { id: string },
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
      current: { id: string },
  ) {
    return this.flagRepo.find({
      where: {
        parent: { id: current.id },
      },
      loadRelationIds: true,
    }).then(list => list.map(item => item?.flag ?? ''));
  }

}
