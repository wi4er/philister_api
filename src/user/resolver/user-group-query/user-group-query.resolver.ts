import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserGroupQuerySchema } from "../../schema/user-group-query.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserGroupEntity } from "../../model/user-group.entity";
import { UserGroupSchema } from "../../schema/user-group.schema";

@Resolver(of => UserGroupQuerySchema)
export class UserGroupQueryResolver {
  constructor(
    @InjectRepository(PropertyEntity)
    private userGroupRepo: Repository<UserGroupEntity>,
  ) {
  }

  @ResolveField('list', type => [ UserGroupSchema ])
  list(
    @Args('limit', {nullable: true, type: () => Int})
      limit: number,
    @Args('offset', {nullable: true, type: () => Int})
      offset: number,
  ) {
    return this.userGroupRepo.find({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField('item', type => UserGroupSchema)
  item(
    @Args('id', { type: () => String })
      id: number
  ) {
    return this.userGroupRepo.findOne({ where: { id } })
  }
}
