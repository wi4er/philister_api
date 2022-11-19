import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserSchema } from "../../schema/user.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserStringEntity } from "../../model/user-string.entity";
import { UserEntity } from "../../model/user.entity";
import { UserPropertySchema } from "../../schema/user-property/user.property.schema";
import { UserUserEntity } from "../../model/user-user.entity";
import { UserValueEntity } from "../../model/user-value.entity";

@Resolver(of => UserSchema)
export class UserResolver {

  constructor(
    @InjectRepository(UserStringEntity)
    private userStringRepo: Repository<UserStringEntity>,

    @InjectRepository(UserUserEntity)
    private userUserRepo: Repository<UserUserEntity>,

    @InjectRepository(UserValueEntity)
    private userValueRepo: Repository<UserValueEntity>,
  ) {
  }

  @ResolveField("property", returns => [ UserPropertySchema ])
  async property(@Parent() user: UserEntity) {
    const list = [].concat(
      await this.userStringRepo.find({
        where: {parent: {id: user.id}},
        relations: {property: true},
      }),
      await this.userUserRepo.find({
        where: {parent: {id: user.id}},
        relations: {user: true, property: true},
      }),
      await this.userValueRepo.find({
        where: {parent: {id: user.id}},
        relations: {property: true, value: true},
      }),
    );

    return list;
  }
}
