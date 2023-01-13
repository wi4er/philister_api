import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { UserUpdateOperation } from "../../operation/user-update.operation";
import { UserInputSchema } from "../../schema/user-input.schema";
import { UserEntity } from "../../model/user.entity";
import { UserMutationSchema } from "../../schema/user-mutation.schema";
import { UserInsertOperation } from "../../operation/user-insert.operation";
import { UserService } from "../../service/user/user.service";
import { User2flagEntity } from "../../model/user2flag.entity";

@Resolver(of => UserMutationSchema)
export class UserMutationResolver {

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private userService: UserService,
    @InjectRepository(User2flagEntity)
    private flagRepo: Repository<User2flagEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: UserInputSchema
  ): Promise<UserEntity> {
    return new UserInsertOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: UserInputSchema
  ) {
    return new UserUpdateOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async updateFlag(
    @Args('id', { type: () => Int })
      id: number,
    @Args('flag')
      flag: string
  ): Promise<UserEntity> {
    const rel = await this.flagRepo.findOne({
      where: {
        parent: { id },
        flag: { id: flag },
      }
    });

    if (rel) {
      await this.flagRepo.delete({ id: rel.id });
    } else {
      await Object.assign(new User2flagEntity(), { parent: id, flag }).save();
    }

    return await this.userRepo.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ Int ] })
      id: number[]
  ): Promise<number[]> {
    return this.userService.deleteUser(id);
  }

}
