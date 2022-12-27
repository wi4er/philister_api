import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FlagStringSchema } from "../../schema/flag-string.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { LangEntity } from "../../../lang/model/lang.entity";

@Resolver(of => FlagStringSchema)
export class FlagStringResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,

    @InjectRepository(LangEntity)
    private langRepo: Repository<LangEntity>,
  ) {
  }

  @ResolveField()
  async property(
    @Parent()
      current: { property: string }
  ) {
    return this.propertyRepo.findOne({
      where: { id: current.property },
      loadRelationIds: true,
    })
  }

  @ResolveField()
  async lang(
    @Parent()
      current: { lang: string }
  ) {
    if (!current.lang) {
      return null;
    }

    return this.langRepo.findOne({
      where: { id: current.lang },
      loadRelationIds: true,
    });
  }

}
