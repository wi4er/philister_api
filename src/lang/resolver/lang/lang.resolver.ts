import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { LangSchema } from "../../schema/lang.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LangStringEntity } from "../../model/lang-string.entity";
import { DirectoryEntity } from "../../../directory/model/directory.entity";
import { LangFlagEntity } from "../../model/lang-flag.entity";

@Resolver(of => LangSchema)
export class LangResolver {

  constructor(
    @InjectRepository(LangStringEntity)
    private stingRepo: Repository<LangStringEntity>,
    @InjectRepository(LangFlagEntity)
    private flagRepo: Repository<LangFlagEntity>,
  ) {
  }

  @ResolveField()
  created_at(
    @Parent()
      current: DirectoryEntity
  ) {
    return new Date(current.created_at).toISOString();
  }

  @ResolveField()
  updated_at(
    @Parent()
      current: DirectoryEntity
  ) {
    return new Date(current.updated_at).toISOString();
  }

  @ResolveField()
  async propertyList(
    @Parent()
      current: { id: string }
  ) {
    return this.stingRepo.find({
      where: { parent: { id: current.id } },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async propertyItem(
    @Args('id')
      id: string,
    @Parent()
      current: { id: string }
  ) {
    return this.stingRepo.findOne({
      where: {
        property: { id },
        parent: { id: current.id },
      },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async propertyString(
    @Args('id')
      id: string,
    @Parent()
      current: { id: string }
  ) {
    return this.stingRepo.findOne({
      where: {
        property: { id },
        parent: { id: current.id },
      },
      loadRelationIds: true,
    }).then(item => item.string);
  }

  @ResolveField()
  async flagList(
    @Parent()
      current: { id: string }
  ) {
    return this.flagRepo.find({
      where: {
        parent: { id: current.id },
      },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async flagString(
    @Parent()
      current: { id: string }
  ) {
    return this.flagRepo.find({
      where: {
        parent: { id: current.id },
      },
      loadRelationIds: true,
    }).then(list => list.map(item => item.id));
  }

}
