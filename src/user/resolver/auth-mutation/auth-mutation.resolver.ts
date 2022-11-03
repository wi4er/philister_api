import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserSchema } from "../../schema/user.schema";
import { AuthMutationSchema } from "../../schema/auth-mutation.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../model/user/user.entity";
import { Repository } from "typeorm";
import { toSha256 } from "../../../encode/toSha256";

@Resolver(of => AuthMutationSchema)
export class AuthMutationResolver {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
  }

  @ResolveField("authByPassword", returns => UserSchema, {nullable: true} )
  async getAuth(
    @Args(
      'login',
      { type: () => String }
    ) login: string,
    @Args(
      'password',
      { type: () => String }
    ) password: string,
  ) {
    const user = await this.userRepo.findOne({where: {login}});

    if (
      !user
      || user.hash !== toSha256(password)
    ) return null;

    return user;
  }
}
