import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockStringSchema } from "../../schema/block-string.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { Repository } from "typeorm";

@Resolver(
  of => BlockStringSchema,
)
export class BlockStringResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
  ) {
  }

  @ResolveField()
  async property(
    @Parent()
      current: { property: string }
  ) {
    return await this.propertyRepo.findOne({ where: { id: current.property } });
  }

}
