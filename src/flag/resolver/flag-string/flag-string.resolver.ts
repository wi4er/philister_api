import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FlagStringSchema } from "../../schema/flag-string.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";

@Resolver(of => FlagStringSchema)
export class FlagStringResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
  ) {
  }

  @ResolveField('property')
  async property(
    @Parent()
      current: {property: string}
  ) {
    return this.propertyRepo.findOne({
      where: {id: current.property},
      loadRelationIds: true,
    })
  }
}
