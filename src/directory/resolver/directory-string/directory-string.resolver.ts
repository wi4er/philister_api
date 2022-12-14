import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryStringSchema } from "../../schema/directory-string.schema";
import { PropertyEntity } from "../../../property/model/property.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LangEntity } from "../../../lang/model/lang.entity";

@Resolver(of => DirectoryStringSchema)
export class DirectoryStringResolver {

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
    return await this.propertyRepo.findOne({
      where: { id: current.property },
      loadRelationIds: true,
    });
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
