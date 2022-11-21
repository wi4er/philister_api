import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { Repository } from "typeorm";
import { ValueStringSchema } from "../../schema/value-string.schema";

@Resolver(of => ValueStringSchema)
export class ValueStringResolver {

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
    return await this.propertyRepo.findOne({where: {id: current.property}});
  }

}
