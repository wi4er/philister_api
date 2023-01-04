import { Controller, Get, Headers, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UserService } from "../../service/user/user.service";
import { Request, Response } from "express";
import { ApiHeader, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SessionService } from "../../service/session/session.service";

@ApiTags('User registration and authorization')
@Controller('auth')
export class AuthController {

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
  ) {
  }

  @Get()
  @ApiHeader({
    name: 'login',
    description: 'User login',
  })
  @ApiHeader({
    name: 'password',
    description: 'User password',
  })
  @ApiResponse({ status: 403, description: 'User login or password incorrect!' })
  @ApiResponse({ status: 200, description: 'Successfully authorized!' })
  async authUser(
    @Headers('login')
      login: string,
    @Headers('password')
      password: string,
    @Req()
      req: Request,
    @Res()
      res: Response,
  ) {
    const user = await this.userService.findByPassword(login, password);

    if (user) {
      req['session']['user'] = { id: user.id };

      res.json(user);
    } else {
      res.status(HttpStatus.UNAUTHORIZED).json();
    }
  }

  @Post()
  async registerUser(
    @Headers('login')
      login: string,
    @Headers('password')
      password: string,
    @Req()
      req: Request,
    @Res()
      res: Response,
  ) {
    if (!login) {
      res.status(400);
      return res.send({ message: 'login expected!' });
    }

    if (!password) {
      res.status(400);
      return res.send({ message: 'password expected!' });
    }

    return this.userService.createByPassword(login, password)
      .then(user => {
        this.sessionService.open(req, user);
        res.json(user);
      })
      .catch(err => {
        if (err.code === '23505') {
          res.status(400);
          return res.json({ message: 'Wrong login or password' });
        }

        res.status(500);
        return res.json(err);
      });
  }

}
