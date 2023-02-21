import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { ElementMutationSchema } from '../../schema/element-mutation.schema';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ElementInputSchema } from '../../schema/element-input.schema';
import { ElementInsertOperation } from '../../operation/element-insert.operation';
import { ElementUpdateOperation } from '../../operation/element-update.operation';
import { ElementDeleteOperation } from '../../operation/element-delete.operation';

@Resolver(of => ElementMutationSchema)
export class ElementMutationResolver {

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: ElementInputSchema,
  ) {
    return new ElementInsertOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: ElementInputSchema,
  ) {
    return new ElementUpdateOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ Int ] })
      id: number[],
  ): Promise<number[]> {
    return new ElementDeleteOperation(this.entityManager).save(id);
  }

}
