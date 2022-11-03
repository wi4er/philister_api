import { ResolveField, Resolver } from '@nestjs/graphql';
import { UserSchema } from "../../schema/user.schema";
import { UserQuerySchema } from "../../schema/user-query.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../model/user/user.entity";
import { Repository } from "typeorm";

@Resolver(of => UserQuerySchema)
export class UserQueryResolver {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
  }

  @ResolveField("list", returns => [ UserSchema ])
  async list() {
    return this.userRepo.find({});
  }

  @ResolveField("item", returns => [ UserSchema ])
  async item() {
    return { id: 22 };
  }
}
