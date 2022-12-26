import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FlagSchema } from "../../schema/flag.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlagStringEntity } from "../../model/flag-string.entity";
import { FlagFlagEntity } from "../../model/flag-flag.entity";

@Resolver(of => FlagSchema)
export class FlagResolver {

  constructor(
    @InjectRepository(FlagFlagEntity)
    private flagRepo: Repository<FlagFlagEntity>,

    @InjectRepository(FlagStringEntity)
    private stringRepo: Repository<FlagStringEntity>,
  ) {
  }

  @ResolveField()
  async propertyList(
    @Parent()
      current: { id: string }
  ) {
    return this.stringRepo.find({
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
    return this.stringRepo.findOne({
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
    return this.stringRepo.findOne({
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
    }).then(list => list.map(item => item.flag));
  }

}
