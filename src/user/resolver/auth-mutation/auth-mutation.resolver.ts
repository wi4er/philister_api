import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthMutationSchema } from '../../schema/auth-mutation.schema';
import { UserEntity } from '../../model/user.entity';
import { UserService } from '../../service/user/user.service';
import { SessionService } from '../../service/session/session.service';
import { Request } from 'express';

@Resolver(of => AuthMutationSchema)
export class AuthMutationResolver {

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
  ) {
  }

  @ResolveField()
  async authByLogin(
    @Args(
      'login',
      { type: () => String },
    ) login: string,
    @Args(
      'password',
      { type: () => String },
    ) password: string,
    @Context()
      context: { req: Request },
  ): Promise<UserEntity | null> {
    const user = await this.userService.findByLogin(login, password);

    if (user) {
      this.sessionService.open(context.req, user);
    }

    return user;
  }

  @ResolveField()
  async registerByLogin(
    @Args(
      'login',
      { type: () => String },
    ) login: string,
    @Args(
      'password',
      { type: () => String },
    ) password: string,
    @Context()
      context: { req: Request },
  ): Promise<UserEntity | null> {

    return null;
  }

  @ResolveField()
  async authByContact(
    @Args(
      'contact',
      { type: () => String },
    ) contact: string,
    @Args(
      'value',
      { type: () => String },
    ) value: string,
    @Args(
      'password',
      { type: () => String },
    ) password: string,
    @Context()
      context: { req: Request },
  ): Promise<UserEntity | null> {
    const user = await this.userService.findByContact(contact, value, password);

    if (user) {
      this.sessionService.open(context.req, user);
    }

    return user;
  }

  @ResolveField()
  async logout(
    @Context()
      context: { req: Request },
  ): Promise<boolean> {
    return this.sessionService.close(context.req);
  }

}
