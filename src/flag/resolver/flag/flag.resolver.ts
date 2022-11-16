import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FlagSchema } from "../../schema/flag.schema";
import { PropertyEntity } from "../../../property/model/property.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlagPropertyEntity } from "../../model/flag-property.entity";
import { FlagFlagEntity } from "../../model/flag-flag.entity";
import { FlagFlagSchema } from "../../schema/flag-flag.schema";
import { FlagPropertySchema } from "../../schema/flag-property.schema";

@Resolver(of => FlagSchema)
export class FlagResolver {

  constructor(
    @InjectRepository(FlagPropertyEntity)
    private propertyRepo: Repository<FlagPropertyEntity>,

    @InjectRepository(FlagFlagEntity)
    private flagRepo: Repository<FlagFlagEntity>,
  ) {
  }

  @ResolveField("property", type => FlagPropertySchema)
  async property(
    @Parent()
      prop: PropertyEntity
  ) {
    return this.propertyRepo.find({
      where: {parent: {id: prop.id}},
      relations: {property: true},
    });
  }

  @ResolveField("flag", type => FlagFlagSchema)
  async flag(
    @Parent()
      prop: PropertyEntity
  ) {
    return this.flagRepo.find({
      where: {parent: {id: prop.id}},
      relations: {flag: true},
    });
  }

}
