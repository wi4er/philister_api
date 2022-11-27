import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FetchLogSchema } from "../../schema/fetch-log.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../../user/model/user.entity";
import { Repository } from "typeorm";

@Resolver(of => FetchLogSchema)
export class FetchLogResolver {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
  }

  @ResolveField()
  async user(
    @Parent()
      current: { user: number }
  ) {
    return this.userRepo.findOne({ where: { id: current.user } });
  }

}
