import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserGroupSchema } from "../../schema/user-group/user-group.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DirectoryEntity } from "../../../directory/model/directory.entity";
import { UserGroup2stringEntity } from "../../model/user-group2string.entity";
import { UserGroup2flagEntity } from "../../model/user-group2flag.entity";
import { UserGroupEntity } from "../../model/user-group.entity";

@Resolver(of => UserGroupSchema)
export class UserGroupResolver {

  constructor(
    @InjectRepository(UserGroup2stringEntity)
    private stringRepo: Repository<UserGroup2stringEntity>,
    @InjectRepository(UserGroup2flagEntity)
    private flagRepo: Repository<UserGroup2flagEntity>,
    @InjectRepository(UserGroupEntity)
    private groupRepo: Repository<UserGroupEntity>,
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
  async parent(
    @Parent()
      current: { parent: number }
  ): Promise<UserGroupEntity> {
    return this.groupRepo.findOne({
      where: { id: current.parent },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async children(
    @Parent()
      current: { id: number }
  ): Promise<UserGroupEntity[]> {
    return this.groupRepo.find({
      where: { parent: { id: current.id } },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async propertyList(
    @Parent()
      current: { id: number }
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
      current: { id: number }
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
    @Args('lang', { nullable: true })
      lang: string | null,
    @Parent()
      current: { id: number }
  ) {
    return this.stringRepo.findOne({
      where: {
        property: { id },
        lang: { id: lang },
        parent: { id: current.id },
      },
      loadRelationIds: true,
    }).then(item => item?.string ?? '');
  }

  @ResolveField()
  async flagList(
    @Parent()
      current: { id: number }
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
      current: { id: number }
  ) {
    return this.flagRepo.find({
      where: {
        parent: { id: current.id },
      },
      loadRelationIds: true,
    }).then(list => list.map(item => item?.flag ?? ''));
  }

}
