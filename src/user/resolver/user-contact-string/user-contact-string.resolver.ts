import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserContactStringSchema } from "../../schema/user-contact-string.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { Repository } from "typeorm";
import { LangEntity } from "../../../lang/model/lang.entity";

@Resolver(of => UserContactStringSchema)
export class UserContactStringResolver {

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
