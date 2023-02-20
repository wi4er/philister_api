import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectionEntity } from '../../model/section.entity';
import { SectionQuerySchema } from '../../schema/section-query.schema';

@Resolver(of => SectionQuerySchema)
export class SectionQueryResolver {

  constructor(
    @InjectRepository(SectionEntity)
    private sectionRepo: Repository<SectionEntity>,
  ) {
  }

  @ResolveField('list')
  async list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.sectionRepo.find({
      skip: offset,
      take: limit,
      loadRelationIds: true,
    });
  }

  @ResolveField('count')
  async count(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.sectionRepo.count({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField('item')
  item(
    @Args('id', { type: () => Int })
      id: number,
  ) {
    return this.sectionRepo.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

}
