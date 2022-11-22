import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { LangFlagSchema } from "../../schema/lang-flag.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FlagEntity } from "../../../flag/model/flag.entity";

@Resolver(of => LangFlagSchema)
export class LangFlagResolver {

  constructor(
    @InjectRepository(FlagEntity)
    private flagRepo: Repository<FlagEntity>,
  ) {
  }

  @ResolveField()
  async flag(
    @Parent()
      current: { flag: string }
  ) {
    return this.flagRepo.findOne({ where: { id: current.flag } });
  }
}
