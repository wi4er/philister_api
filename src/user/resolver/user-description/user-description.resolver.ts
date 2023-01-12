import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserDescriptionSchema } from "../../schema/user-property/user-description.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { Repository } from "typeorm";
import { LangEntity } from "../../../lang/model/lang.entity";

@Resolver(of => UserDescriptionSchema)
export class UserDescriptionResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
    @InjectRepository(LangEntity)
    private langRepo: Repository<LangEntity>,
  ) {
  }

  @ResolveField()
  async string(
    @Parent()
      current: { description: string }
  ) {
    return current.description;
  }

  @ResolveField()
  async description(
    @Parent()
      current: { description: string }
  ) {
    return current.description;
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
