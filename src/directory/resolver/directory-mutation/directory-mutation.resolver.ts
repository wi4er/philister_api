import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryMutationSchema } from "../../schema/directory-mutation.schema";
import { EntityManager, In, Repository } from "typeorm";
import { DirectoryEntity } from "../../model/directory.entity";
import { DirectoryInputSchema } from "../../schema/directory-input.schema";
import { DirectoryStringEntity } from "../../model/directory-string.entity";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { ValueEntity } from "../../model/value.entity";
import { DirectoryInsertOperation } from "../../operation/directory-insert.operation";
import { DirectoryUpdateOperation } from "../../operation/directory-update.operation";

@Resolver(of => DirectoryMutationSchema)
export class DirectoryMutationResolver {

  constructor(
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
    @InjectRepository(ValueEntity)
    private valueRepo: Repository<ValueEntity>,
    @InjectRepository(DirectoryStringEntity)
    private directoryPropertyRepo: Repository<DirectoryStringEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: DirectoryInputSchema
  ): Promise<DirectoryEntity> {
    return new DirectoryInsertOperation(item).save(this.entityManager);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: DirectoryInputSchema
  ): Promise<DirectoryEntity> {
    return new DirectoryUpdateOperation(item).save(this.entityManager);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[]
  ): Promise<string[]> {
    const result = [];
    const list = await this.directoryRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.directoryRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
