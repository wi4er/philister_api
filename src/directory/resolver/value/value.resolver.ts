import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryEntity } from '../../model/directory.entity';
import { ValueSchema } from '../../schema/value.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Value2stringEntity } from '../../model/value2string.entity';
import { ValueEntity } from '../../model/value.entity';
import { Value2flagEntity } from '../../model/value2flag.entity';

@Resolver(of => ValueSchema)
export class ValueResolver {

  constructor(
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
    @InjectRepository(Value2stringEntity)
    private stringRepo: Repository<Value2stringEntity>,
    @InjectRepository(Value2flagEntity)
    private flagRepo: Repository<Value2flagEntity>,
  ) {
  }

  @ResolveField()
  created_at(
    @Parent()
      current: DirectoryEntity,
  ) {
    return new Date(current.created_at).toISOString();
  }

  @ResolveField()
  updated_at(
    @Parent()
      current: DirectoryEntity,
  ) {
    return new Date(current.updated_at).toISOString();
  }

  @ResolveField()
  async directory(
    @Parent()
      current: { directory: string },
  ) {
    return this.directoryRepo.findOne({ where: { id: current.directory } });
  }

  @ResolveField()
  async propertyList(
    @Parent()
      current: ValueEntity,
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
      current: ValueEntity,
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
      current: ValueEntity,
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
