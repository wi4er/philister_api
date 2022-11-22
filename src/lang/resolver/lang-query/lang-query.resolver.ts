import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { LangQuerySchema } from "../../schema/lang-query.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LangEntity } from "../../model/lang.entity";

@Resolver(of => LangQuerySchema)
export class LangQueryResolver {

  constructor(
    @InjectRepository(LangEntity)
    private langRepo: Repository<LangEntity>,
  ) {
  }

  @ResolveField()
  list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.langRepo.find({
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
    return this.langRepo.count({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField()
  item(
    @Args('id', { type: () => String })
      id: string
  ) {
    return this.langRepo.findOne({ where: { id } })
  }

}
