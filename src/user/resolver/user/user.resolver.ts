import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserSchema } from "../../schema/user.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { User2stringEntity } from "../../model/user2string.entity";
import { UserEntity } from "../../model/user.entity";
import { User2userEntity } from "../../model/user2user.entity";
import { User2valueEntity } from "../../model/user2value.entity";
import { DirectoryEntity } from "../../../directory/model/directory.entity";
import { User2flagEntity } from "../../model/user2flag.entity";
import { User2userContactEntity } from "../../model/user2user-contact.entity";
import { User2descriptionEntity } from "../../model/user2description.entity";
import { UserGroupEntity } from "../../model/user-group.entity";
import { User2userGroupEntity } from "../../model/user2user-group.entity";

@Resolver(of => UserSchema)
export class UserResolver {

  constructor(
    @InjectRepository(User2stringEntity)
    private stringRepo: Repository<User2stringEntity>,
    @InjectRepository(User2descriptionEntity)
    private descriptionRepo: Repository<User2descriptionEntity>,
    @InjectRepository(User2userEntity)
    private userUserRepo: Repository<User2userEntity>,
    @InjectRepository(User2valueEntity)
    private userValueRepo: Repository<User2valueEntity>,
    @InjectRepository(User2flagEntity)
    private flagRepo: Repository<User2flagEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(UserGroupEntity)
    private groupRepo: Repository<UserGroupEntity>,
    @InjectRepository(User2userContactEntity)
    private contactRepo: Repository<User2userContactEntity>,
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
  async group(
    @Parent()
      current: { id: number },
  ): Promise<UserGroupEntity[]> {
    return this.groupRepo.find({
      where: {
        user: { parent: { id: current.id } }
      },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async contact(
    @Parent()
      current: { id: number },
  ) {
    return this.contactRepo.find({
      where: { parent: { id: current.id } },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async propertyList(
    @Parent()
      current: { id: number }
  ) {
    const list = [].concat(
      await this.stringRepo.find({
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
      await this.descriptionRepo.find({
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
      current: { id: number },
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
