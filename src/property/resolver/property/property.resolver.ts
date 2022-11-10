import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertySchema } from "../../schema/property.schema";
import { PropertyEntity } from "../../model/property.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PropertyPropertyEntity } from "../../model/property-property.entity";

@Resolver(of => PropertySchema)
export class PropertyResolver {

  constructor(
    @InjectRepository(PropertyPropertyEntity)
    private propertyRepo: Repository<PropertyPropertyEntity>,
  ) {
  }

  @ResolveField("property", type => PropertySchema)
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
