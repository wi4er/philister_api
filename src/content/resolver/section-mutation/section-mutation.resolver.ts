import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { SectionInputSchema } from '../../schema/section-input.schema';
import { SectionMutationSchema } from '../../schema/section-mutation.schema';
import { SectionInsertOperation } from '../../operation/section-insert.operation';
import { SectionUpdateOperation } from '../../operation/section-update.operation';
import { SectionDeleteOperation } from '../../operation/section-delete.operation';

@Resolver(of => SectionMutationSchema)
export class SectionMutationResolver {

  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: SectionInputSchema,
  ) {
    return new SectionInsertOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: SectionInputSchema,
  ) {
    return new SectionUpdateOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ Int ] })
      id: number[],
  ): Promise<number[]> {
    return new SectionDeleteOperation(this.entityManager).save(id);
  }

}
