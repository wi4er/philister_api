import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserSchema } from "../../schema/user.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User2stringEntity } from "../../model/user2string.entity";
import { UserEntity } from "../../model/user.entity";
import { User2userEntity } from "../../model/user2user.entity";
import { User2valueEntity } from "../../model/user2value.entity";
import { DirectoryEntity } from "../../../directory/model/directory.entity";
import { User2flagEntity } from "../../model/user2flag.entity";

@Resolver(of => UserSchema)
export class UserResolver {

  constructor(
    @InjectRepository(User2stringEntity)
    private userStringRepo: Repository<User2stringEntity>,
    @InjectRepository(User2userEntity)
    private userUserRepo: Repository<User2userEntity>,
    @InjectRepository(User2valueEntity)
    private userValueRepo: Repository<User2valueEntity>,
    @InjectRepository(User2flagEntity)
    private flagRepo: Repository<User2flagEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
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
      current: { id: number }
  ) {
    const list = [].concat(
      await this.userStringRepo.find({
        where: { parent: { id: current.id } },
        loadRelationIds: true,
      }),
      await this.userUserRepo.find({
        where: { parent: { id: current.id } },
        loadRelationIds: true,
      }),
      await this.userValueRepo.find({
        where: { parent: { id: current.id } },
        loadRelationIds: true,
      }),
    );

    return list;
  }

  @ResolveField()
  async propertyItem(
    @Args('id')
      id: string,
    @Parent()
      current: { id: number }
  ) {
    return this.userStringRepo.findOne({
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
    return this.userStringRepo.findOne({
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
