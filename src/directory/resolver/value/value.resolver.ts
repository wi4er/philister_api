import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryEntity } from "../../model/directory.entity";
import { ValueEntity } from "../../model/value.entity";
import { ValueSchema } from "../../schema/value.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ValuePropertySchema } from "../../schema/value-property.schema";
import { ValueStringEntity } from "../../model/value.string.entity";

@Resolver(of => ValueSchema)
export class ValueResolver {

  constructor(
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
    @InjectRepository(ValueStringEntity)
    private stingRepo: Repository<ValueStringEntity>,
  ) {
  }

  @ResolveField()
  created_at(
    @Parent()
      current: DirectoryEntity
  ) {
    return new Date(current.created_at).toISOString();
  }

  @ResolveField()
  updated_at(
    @Parent()
      current: DirectoryEntity
  ) {
    return new Date(current.updated_at).toISOString();
  }

  @ResolveField('directory')
  async directory(
    @Parent()
      current: { directory: string }
  ) {
    return this.directoryRepo.findOne({ where: { id: current.directory } });
  }

  @ResolveField()
  async propertyList(
    @Parent()
      current: { id: string }
  ) {
    return this.stingRepo.find({ where: { parent: { id: current.id } } });
  }

  @ResolveField()
  async propertyItem(
    @Args('id')
      id: string,
    @Parent()
      current: { id: string }
  ) {
    return this.stingRepo.findOne({
      where: {
        property: { id },
        parent: { id: current.id },
      }
    });
  }

  @ResolveField()
  async propertyString(
    @Args('id')
      id: string,
    @Parent()
      current: { id: string }
  ) {
    return this.stingRepo.findOne({
      where: {
        property: { id },
        parent: { id: current.id },
      }
    }).then(item => item.string);
  }

}
