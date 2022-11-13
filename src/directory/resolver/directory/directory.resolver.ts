import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertySchema } from "../../../property/schema/property.schema";
import { DirectorySchema } from "../../schema/directory.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DirectoryPropertyEntity } from "../../model/directory-property.entity";
import { DirectoryEntity } from "../../model/directory.entity";
import { ValueSchema } from "../../schema/value.schema";
import { ValueEntity } from "../../model/value.entity";

@Resolver(of => DirectorySchema)
export class DirectoryResolver {

  constructor(
    @InjectRepository(DirectoryPropertyEntity)
    private propertyRepo: Repository<DirectoryPropertyEntity>,

    @InjectRepository(ValueEntity)
    private valueRepo: Repository<ValueEntity>,
  ) {
  }

  @ResolveField('property', type => PropertySchema)
  async property(
    @Parent()
      prop: DirectoryEntity
  ) {
    return this.propertyRepo.find({
      where: {parent: {id: prop.id}},
      relations: {property: true},
    });
  }

  @ResolveField('value', type => [ValueSchema])
  async value(
    @Parent()
      prop: DirectoryEntity
  ) {
    return this.valueRepo.find({
      where: {directory: {id: prop.id}},
      // loadRelationIds: true,
      relations: {directory: true},
    });
  }

}
