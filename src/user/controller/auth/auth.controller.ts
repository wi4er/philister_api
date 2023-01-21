import { Controller, Delete, Get, Headers, HttpStatus, Req, Res } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { Request, Response } from 'express';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionService } from '../../service/session/session.service';

@ApiTags('User authorization')
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
  async createSession(
    @Headers('login')
      login: string,
    @Headers('password')
      password: string,
    @Req()
      req: Request,
    @Res()
      res: Response,
  ) {
    const user = await this.userService.findByLogin(login, password);

    if (user) {
      this.sessionService.open(req, user);
      res.json(user);
    } else {
      res.status(HttpStatus.UNAUTHORIZED).json();
    }
  }

  @Delete()
  @ApiResponse({ status: 200, description: 'Session was successfully closed!' })
  @ApiResponse({ status: 400, description: 'Session not found!' })
  async closeSession(
    @Req()
      req: Request,
    @Res()
      res: Response,
  ) {
    if (this.sessionService.close(req)) {
      res.status(200);
      res.json(true);
    } else {
      res.status(400);
      res.json(false);
    }
  }

}
