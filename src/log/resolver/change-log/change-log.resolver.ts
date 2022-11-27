import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ChangeLogSchema } from "../../schema/change-log.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../../user/model/user.entity";

@Resolver(of => ChangeLogSchema)
export class ChangeLogResolver {

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
