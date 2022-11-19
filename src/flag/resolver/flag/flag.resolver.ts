import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FlagSchema } from "../../schema/flag.schema";
import { PropertyEntity } from "../../../property/model/property.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlagStringEntity } from "../../model/flag-string.entity";
import { FlagFlagEntity } from "../../model/flag-flag.entity";
import { FlagFlagSchema } from "../../schema/flag-flag.schema";
import { FlagStringSchema } from "../../schema/flag-string.schema";

@Resolver(of => FlagSchema)
export class FlagResolver {

  constructor(
    @InjectRepository(FlagStringEntity)
    private propertyRepo: Repository<FlagStringEntity>,

    @InjectRepository(FlagFlagEntity)
    private flagRepo: Repository<FlagFlagEntity>,
  ) {
  }

  @ResolveField("property", type => FlagStringSchema)
  async property(
    @Parent()
      prop: PropertyEntity
  ) {
    return this.propertyRepo.find({
      where: {parent: {id: prop.id}},
      loadRelationIds: true,
    });
  }

  @ResolveField("flag", type => FlagFlagSchema)
  async flag(
    @Parent()
      prop: PropertyEntity
  ) {
    return this.flagRepo.find({
      where: {parent: {id: prop.id}},
      loadRelationIds: true,
    });
  }

}
