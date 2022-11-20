import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertySchema } from "../../../property/schema/property.schema";
import { DirectorySchema } from "../../schema/directory.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DirectoryStringEntity } from "../../model/directory-string.entity";
import { DirectoryEntity } from "../../model/directory.entity";
import { ValueSchema } from "../../schema/value.schema";
import { ValueEntity } from "../../model/value.entity";

@Resolver(of => DirectorySchema)
export class DirectoryResolver {

  constructor(
    @InjectRepository(DirectoryStringEntity)
    private propertyRepo: Repository<DirectoryStringEntity>,

    @InjectRepository(ValueEntity)
    private valueRepo: Repository<ValueEntity>,
  ) {
  }

  @ResolveField('property')
  async property(
    @Parent()
      prop: DirectoryEntity
  ) {
    return this.propertyRepo.find({
      where: {parent: {id: prop.id}},
      loadRelationIds: true,
    });
  }

  @ResolveField('value')
  async value(
    @Parent()
      prop: DirectoryEntity
  ) {
    return this.valueRepo.find({
      where: {directory: {id: prop.id}},
      loadRelationIds: true,
    });
  }

}
