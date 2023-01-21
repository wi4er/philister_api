import { Body, Controller, Get, Headers, HttpStatus, Post, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../model/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserService } from '../../service/user/user.service';
import { SessionService } from '../../service/session/session.service';
import { ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserSchema } from '../../schema/user.schema';
import { UserInputSchema } from '../../schema/user-input.schema';
import { UserUpdateOperation } from '../../operation/user-update.operation';

@Controller('myself')
export class MyselfController {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private userService: UserService,
    private sessionService: SessionService,
  ) {
  }

  @Get()
  async getMyself(
    @Req()
      req: Request,
    @Res()
      res: Response,
  ) {
    const id = req['session']?.['user']?.['id'];

    if (id) {
      res.json(await this.userRepo.findOne({ where: { id }, loadRelationIds: true }));
    } else {
      res.status(HttpStatus.UNAUTHORIZED);
      res.send(null);
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

  @Put()
  @ApiOperation({ description: 'Update user by current session' })
  @ApiCreatedResponse({ description: 'Current user updated successfully', type: UserSchema })
  @ApiUnauthorizedResponse({ description: 'There is no current session' })
  async updateMyself(
    @Body()
      user: UserInputSchema,
    @Req()
      req: Request,
    @Res()
      res: Response,
  ) {
    const id = req['session']?.['user']?.['id'];

    if (!id) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.send(null);
    } else {
      res.status(201);
      res.send(await new UserUpdateOperation(this.entityManager).save(user));
    }
  }

}
