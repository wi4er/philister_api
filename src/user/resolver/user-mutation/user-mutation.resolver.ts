import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { UserUpdateOperation } from "../../operation/user-update.operation";
import { UserInputSchema } from "../../schema/user-input.schema";
import { UserEntity } from "../../model/user.entity";
import { UserMutationSchema } from "../../schema/user-mutation.schema";
import { UserInsertOperation } from "../../operation/user-insert.operation";

@Resolver(of => UserMutationSchema)
export class UserMutationResolver {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {

  }

  @ResolveField()
  async add(
    @Args('item')
      item: UserInputSchema
  ): Promise<UserEntity> {
    return new UserInsertOperation(item).save(this.entityManager);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: UserInputSchema
  ) {
    return new UserUpdateOperation(item).save(this.entityManager);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[]
  ) {
    const result = [];
    const list = await this.userRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.userRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }
}
