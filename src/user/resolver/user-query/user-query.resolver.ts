import { Context, ResolveField, Resolver } from '@nestjs/graphql';
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
  async item(
    @Context()
      context: { req: Request },
  ) {
    context.req['session'].user = { user: 1 }

    return { id: 22 };
  }

  @ResolveField("myself", returns => [ UserSchema ])
  async myself(
    @Context()
      context: { req: Request },
  ): Promise<UserEntity> | null {
    const id = context.req['session']?.['user']?.['id'];

    if (!id) return null;

    return await this.userRepo.findOne({ where: { id } });
  }
}
