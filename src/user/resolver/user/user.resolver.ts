import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserSchema } from "../../schema/user.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User2stringEntity } from "../../model/user2string.entity";
import { UserEntity } from "../../model/user.entity";
import { UserPropertySchema } from "../../schema/user-property/user-property.schema";
import { User2userEntity } from "../../model/user2user.entity";
import { User2valueEntity } from "../../model/user2value.entity";

@Resolver(of => UserSchema)
export class UserResolver {

  constructor(
    @InjectRepository(User2stringEntity)
    private userStringRepo: Repository<User2stringEntity>,

    @InjectRepository(User2userEntity)
    private userUserRepo: Repository<User2userEntity>,

    @InjectRepository(User2valueEntity)
    private userValueRepo: Repository<User2valueEntity>,
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
