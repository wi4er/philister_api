import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { FlagQuerySchema } from "../../schema/flag-query.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlagEntity } from "../../model/flag.entity";

@Resolver(of => FlagQuerySchema)
export class FlagQueryResolver {

  constructor(
    @InjectRepository(FlagEntity)
    private flagRepo: Repository<FlagEntity>,
  ) {
  }

  @ResolveField()
  list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.flagRepo.find({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField()
  count(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.flagRepo.count({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField()
  item(
    @Args('id')
      id: string
  ) {
    return this.flagRepo.findOne({ where: { id } });
  }

}
