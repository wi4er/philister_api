import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { FetchLogQuerySchema } from "../../schema/fetch-log-query.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FetchLogEntity } from "../../model/fetch-log.entity";

@Resolver(of => FetchLogQuerySchema)
export class FetchLogQueryResolver {

  constructor(
    @InjectRepository(FetchLogEntity)
    private logRepo: Repository<FetchLogEntity>,
  ) {
  }

  @ResolveField()
  async list(
    @Args('limit', {nullable: true, type: () => Int})
      limit: number,
    @Args('offset', {nullable: true, type: () => Int})
      offset: number,
  ): Promise<FetchLogEntity[]> {
    return this.logRepo.find({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField()
  async count(
    @Args('limit', {nullable: true, type: () => Int})
      limit: number,
    @Args('offset', {nullable: true, type: () => Int})
      offset: number,
  ): Promise<number> {
    return this.logRepo.count({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField()
  async item(
    @Args('id', { type: () => String })
      id: number
  ): Promise<FetchLogEntity | null> {
    return this.logRepo.findOne({ where: { id } });
  }

}
