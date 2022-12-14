import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ValueEntity } from "../../model/value.entity";
import { ValueQuerySchema } from "../../schema/value-query.schema";

@Resolver(of => ValueQuerySchema)
export class ValueQueryResolver {

  constructor(
    @InjectRepository(ValueEntity)
    private valueRepo: Repository<ValueEntity>,
  ) {
  }

  @ResolveField()
  async list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.valueRepo.find({
      skip: offset,
      take: limit,
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async count(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.valueRepo.count({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField()
  item(
    @Args('id', { type: () => String })
      id: string
  ) {
    return this.valueRepo.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

}
