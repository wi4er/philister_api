import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryStringSchema } from "../../schema/directory-string.schema";
import { PropertyEntity } from "../../../property/model/property.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Resolver(of => DirectoryStringSchema)
export class DirectoryStringResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
  ) {
  }

  @ResolveField('property')
  async property(
    @Parent()
      current: { property: string }
  ) {
    return await this.propertyRepo.findOne({ where: { id: current.property } });
  }

}
