import { Args, Context, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { UserQuerySchema } from "../../schema/user-query.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../model/user.entity";
import { Repository } from "typeorm";

@Resolver(of => UserQuerySchema)
export class UserQueryResolver {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
  }

  @ResolveField()
  async list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.userRepo.find({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField()
  async count(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.userRepo.count({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField()
  async item(
    @Args('id', { type: () => Int })
      id: number,
    @Context()
      context: { req: Request },
  ) {
    return this.userRepo.findOne({ where: { id } });
  }

  @ResolveField()
  async myself(
    @Context()
      context: { req: Request },
  ): Promise<UserEntity> | null {
    const id = context.req['session']?.['user']?.['id'];

    if (!id) return null;

    return this.userRepo.findOne({ where: { id } });
  }
}
