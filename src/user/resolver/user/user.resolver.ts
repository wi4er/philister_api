import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserSchema } from "../../schema/user.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserPropertySchema } from "../../schema/user-property.schema";
import { UserPropertyEntity } from "../../model/user-property.entity";
import { UserEntity } from "../../model/user.entity";

@Resolver(of => UserSchema)
export class UserResolver {

  constructor(
    @InjectRepository(UserPropertyEntity)
    private userPropertyRepo: Repository<UserPropertyEntity>,
  ) {
  }

  @ResolveField("property", returns => [ UserPropertySchema ])
  async property(@Parent() user: UserEntity) {

    console.log(user)

    const list = await this.userPropertyRepo.find({
      where: {
        user: {id: user.id}
      },
      relations: {
        property: true
      },
    });

    return list;
  }
}
