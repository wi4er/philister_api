import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertySchema } from "../../schema/property.schema";
import { PropertyEntity } from "../../model/property.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PropertyPropertyEntity } from "../../model/property-property.entity";
import { DirectoryEntity } from "../../../directory/model/directory.entity";

@Resolver(of => PropertySchema)
export class PropertyResolver {

  constructor(
    @InjectRepository(PropertyPropertyEntity)
    private propertyRepo: Repository<PropertyPropertyEntity>,
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

  @ResolveField()
  async property(
    @Parent()
      prop: PropertyEntity
  ) {
    return this.propertyRepo.find({
      where: {parent: {id: prop.id}},
      relations: {property: true},
    });
  }

}
