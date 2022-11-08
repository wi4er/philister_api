import { Args, Context, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { UserSchema } from "../../schema/user.schema";
import { UserQuerySchema } from "../../schema/user-query.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../model/user.entity";
import { Repository } from "typeorm";
import { ServerResponse } from "http";

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
  async item(
    @Args('id', { type: () => Int })
      id: number,
    @Context()
      context: { req: Request },
  ) {
    return this.userRepo.findOne({where: {id}});
  }

  @ResolveField("myself", returns => [ UserSchema ])
  async myself(
    @Context()
      context: { req: Request },
  ): Promise<UserEntity> | null {
    const id = context.req['session']?.['user']?.['id'];

    if (!id) return null;

    return this.userRepo.findOne({ where: { id } });
  }
}
