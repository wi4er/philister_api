import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { UserGroupMutationSchema } from "../../schema/user-group/user-group-mutation.schema";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { UserGroupEntity } from "../../model/user-group.entity";
import { UserGroupInputSchema } from "../../schema/user-group/user-group-input.schema";
import { UserGroupInsertOperation } from "../../operation/user-group-insert.operation";
import { UserGroupUpdateOperation } from "../../operation/user-group-update.operation";

@Resolver(of => UserGroupMutationSchema)
export class UserGroupMutationResolver {

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    @InjectRepository(UserGroupEntity)
    private groupRepo: Repository<UserGroupEntity>,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: UserGroupInputSchema
  ): Promise<UserGroupEntity> {
    return new UserGroupInsertOperation(item).save(this.entityManager);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: UserGroupInputSchema
  ): Promise<UserGroupEntity> {
    return new UserGroupUpdateOperation(item).save(this.entityManager);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[]
  ): Promise<string[]> {
    const result = [];
    const list = await this.groupRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.groupRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
