import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { LangStringSchema } from "../../schema/lang-string.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { Repository } from "typeorm";
import { LangEntity } from "../../model/lang.entity";

@Resolver(of => LangStringSchema)
export class LangStringResolver {

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
      current: {property: string}
  ) {
    return await this.propertyRepo.findOne({where: {id: current.property}});
  }

  @ResolveField()
  async lang(
    @Parent()
      current: {lang: string}
  ) {
    return await this.langRepo.findOne({where: {id: current.lang}});
  }

}
