import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserUserSchema } from "../../schema/user-property/user-user.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { Repository } from "typeorm";
import { UserEntity } from "../../model/user.entity";

@Resolver(of => UserUserSchema)
export class UserUserResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
  }

  @ResolveField()
  async string(
    @Parent()
      current: { user: number }
  ) {
    return current.user;
  }

  @ResolveField()
  async user(
    @Parent()
      current: { user: number }
  ) {
    return this.userRepo.findOne({
      where: { id: current.user },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async property(
    @Parent()
      current: { property: string }
  ) {
    return this.propertyRepo.findOne({
      where: { id: current.property },
      loadRelationIds: true,
    });
  }

}
