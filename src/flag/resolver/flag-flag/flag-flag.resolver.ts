import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FlagFlagSchema } from "../../schema/flag-flag.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlagEntity } from "../../model/flag.entity";

@Resolver(of => FlagFlagSchema)
export class FlagFlagResolver {

  constructor(
    @InjectRepository(FlagEntity)
    private flagRepo: Repository<FlagEntity>,
  ) {
  }

  @ResolveField('flag')
  async flag(
    @Parent()
      current: {flag: string}
  ) {
    return this.flagRepo.findOne({where: {id: current.flag}});
  }
}
