import { Args, Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserSchema } from "../../schema/user.schema";
import { AuthMutationSchema } from "../../schema/auth-mutation.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../model/user.entity";
import { Repository } from "typeorm";
import { EncodeService } from "../../service/encode/encode.service";

@Resolver(of => AuthMutationSchema)
export class AuthMutationResolver {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private encodeService: EncodeService,
  ) {
  }

  @ResolveField("authByPassword", returns => UserSchema, { nullable: true })
  async getAuth(
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
  ) {
    const user = await this.userRepo.findOne({ where: { login } });

    if (
      !user
      || user.hash !== this.encodeService.toSha256(password)
    ) return null;

    context.req['session']['user'] = {id: user.id};

    return user;
  }
}
