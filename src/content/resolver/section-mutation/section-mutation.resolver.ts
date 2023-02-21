import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { SectionInputSchema } from '../../schema/section-input.schema';
import { SectionEntity } from '../../model/section.entity';
import { SectionMutationSchema } from '../../schema/section-mutation.schema';
import { SectionInsertOperation } from '../../operation/section-insert.operation';
import { SectionUpdateOperation } from '../../operation/section-update.operation';

@Resolver(of => SectionMutationSchema)
export class SectionMutationResolver {

  constructor(
    @InjectRepository(SectionEntity)
    private sectionRepo: Repository<SectionEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: SectionInputSchema
  ) {
    return new SectionInsertOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async update(
    @Args('item')
      item: SectionInputSchema
  ) {
    return new SectionUpdateOperation(this.entityManager).save(item);
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ Int ] })
      id: number[]
  ): Promise<number[]> {
    const result = [];
    const list = await this.sectionRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.sectionRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
