import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { UserUpdateOperation } from "../../operation/user-update.operation";
import { UserInputSchema } from "../../schema/user-input.schema";
import { UserEntity } from "../../model/user.entity";
import { UserMutationSchema } from "../../schema/user-mutation.schema";
import { UserInsertOperation } from "../../operation/user-insert.operation";
import { UserService } from "../../service/user/user.service";

@Resolver(of => UserMutationSchema)
export class UserMutationResolver {

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private userService: UserService,
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
    @Args('id', { type: () => [ Int ] })
      id: number[]
  ): Promise<number[]> {
    return this.userService.deleteUser(id);
  }

}
