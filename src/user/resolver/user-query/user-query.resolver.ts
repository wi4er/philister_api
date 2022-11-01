import { ResolveField, Resolver } from '@nestjs/graphql';
import { User } from "../../schema/User";
import { UserQuery } from "../../schema/UserQuery";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../model/User.entity";
import { Repository } from "typeorm";

@Resolver(of => UserQuery)
export class UserQueryResolver {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
  }

  @ResolveField("list", returns => [ User ])
  async list() {
    return this.userRepo.find({});
  }

  @ResolveField("item", returns => [ User ])
  async item() {
    return { id: 22 };
  }
}
