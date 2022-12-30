import { Args, Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserSchema } from "../../schema/user.schema";
import { AuthMutationSchema } from "../../schema/auth-mutation.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../model/user.entity";
import { Repository } from "typeorm";
import { EncodeService } from "../../service/encode/encode.service";
import { UserService } from "../../service/user/user.service";

@Resolver(of => AuthMutationSchema)
export class AuthMutationResolver {

  constructor(
    private userService: UserService,
  ) {
  }

  @ResolveField()
  async authByPassword(
    @Args(
      'login',
      { type: () => String }
    ) login: string,
    @Args(
      'password',
      { type: () => String }
    ) password: string,
    @Context()
      context: { req: Request },
  ): Promise<UserEntity> {
    const user = await this.userService.findByPassword(login, password);

    if (user) {
      context.req['session']['user'] = { id: user.id };
    }

    return user;
  }
}
