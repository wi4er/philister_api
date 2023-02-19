import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { ElementMutationSchema } from '../../schema/element-mutation.schema';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { ElementInputSchema } from '../../schema/element-input.schema';
import { ElementEntity } from '../../model/element.entity';

@Resolver(of => ElementMutationSchema)
export class ElementMutationResolver {

  constructor(
    @InjectRepository(ElementEntity)
    private elementRepo: Repository<ElementEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: ElementInputSchema
  ) {
    return;
  }

  @ResolveField()
  async update(
    @Args('item')
      item: ElementInputSchema
  ) {
    return;
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ Int ] })
      id: number[]
  ): Promise<number[]> {
    const result = [];
    const list = await this.elementRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.elementRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
