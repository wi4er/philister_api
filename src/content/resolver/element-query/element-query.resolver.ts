import { Args, Field, InputType, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElementEntity } from '../../model/element.entity';
import { ElementQuerySchema } from '../../schema/element-query.schema';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@InputType('ElementFilter')
class ElementFilterSchema {

  @Field()
  field: string;

  @Field({ nullable: true })
  operation: string;

  @Field()
  value: string;

}

@Resolver(of => ElementQuerySchema)
export class ElementQueryResolver {

  constructor(
    @InjectRepository(ElementEntity)
    private elementRepo: Repository<ElementEntity>,
  ) {
  }

  toWhere(filter?: ElementFilterSchema[]): FindOptionsWhere<ElementEntity> {
    const where = {};

    for (const item of filter ?? []) {
      if (item.field === 'block') {
        where['block'] = { id: +item.value };
      }
    }

    return where;
  }

  @ResolveField('list')
  async list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
    @Args('filter', { nullable: true, type: () => [ ElementFilterSchema ] })
      filter?: ElementFilterSchema[],
  ) {
    return this.elementRepo.find({
      skip: offset,
      take: limit,
      where: this.toWhere(filter),
      loadRelationIds: true,
    });
  }

  @ResolveField('count')
  async count(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
    @Args('filter', { nullable: true, type: () => [ ElementFilterSchema ] })
      filter?: ElementFilterSchema[],
  ) {
    return this.elementRepo.count({
      skip: offset,
      take: limit,
      where: this.toWhere(filter),
    });
  }

  @ResolveField('item')
  item(
    @Args('id', { type: () => Int })
      id: number,
  ) {
    return this.elementRepo.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

}
