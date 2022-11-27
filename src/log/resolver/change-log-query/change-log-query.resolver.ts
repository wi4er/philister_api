import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChangeLogQuerySchema } from "../../schema/change-log-query.schema";
import { ChangeLogEntity } from "../../model/change-log.entity";

@Resolver(of => ChangeLogQuerySchema)
export class ChangeLogQueryResolver {

  constructor(
    @InjectRepository(ChangeLogEntity)
    private logRepo: Repository<ChangeLogEntity>,
  ) {
  }

  @ResolveField()
  async list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.logRepo.find({
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
    return this.logRepo.count({
      skip: offset,
      take: limit,
    });
  }

  // @ResolveField()
  // item(
  //   @Args('id', { type: () => String })
  //     id: number
  // ) {
  //   return this.logRepo.findOne({
  //     where: { id },
  //     loadRelationIds: true,
  //   });
  // }

}
