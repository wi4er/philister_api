import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserGroupEntity } from "../../model/user-group.entity";
import { UserGroupQuerySchema } from "../../schema/user-group/user-group-query.schema";

@Resolver(of => UserGroupQuerySchema)
export class UserGroupQueryResolver {

  constructor(
    @InjectRepository(UserGroupEntity)
    private userGroupRepo: Repository<UserGroupEntity>,
  ) {
  }

  @ResolveField()
  list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.userGroupRepo.find({
      skip: offset,
      take: limit,
      loadRelationIds: true,
    });
  }

  @ResolveField()
  count(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ): Promise<number> {
    return this.userGroupRepo.count({
      skip: offset,
      take: limit,
      loadRelationIds: true,
    });
  }

  @ResolveField()
  item(
    @Args('id', { type: () => Int })
      id: number
  ): Promise<UserGroupEntity | null> {
    return this.userGroupRepo.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

}
