import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { FlagMutationSchema } from "../../schema/flag-mutation.schema";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { FlagEntity } from "../../model/flag.entity";
import { FlagInputSchema } from "../../schema/flag-input.schema";
import { FlagInsertOperation } from "../../operation/flag-insert.operation";
import { FlagUpdateOperation } from "../../operation/flag-update.operation";

@Resolver(of => FlagMutationSchema)
export class FlagMutationResolver {

  constructor(
    @InjectRepository(FlagEntity)
    private flagReo: Repository<FlagEntity>,

    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {

  }

  @ResolveField()
  async add(
    @Args('item')
      item: FlagInputSchema
  ): Promise<FlagEntity> {
    return new FlagInsertOperation(item).save(this.entityManager);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: FlagInputSchema
  ) {
    return new FlagUpdateOperation(item).save(this.entityManager);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[]
  ) {
    const result = [];
    const list = await this.flagReo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.flagReo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
