import { Body, Controller, Get, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../model/user.entity";
import { EntityManager, Repository } from "typeorm";
import { Request, Response } from "express";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserInputSchema } from "../../schema/user-input.schema";

@ApiTags('User object')
@Controller('user')
export class UserController {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
  }

  @Get()
  async list() {
    return this.userRepo.find()
  }

  @Get('myself')
  async getMyself(
    @Req()
      req: Request,
    @Res()
      res: Response,
  ) {
    const id = req['session']?.['user']?.['id'];

    if (id) {
      res.json(this.userRepo.findOne({ where: { id }, loadRelationIds: true }));
    } else {
      res.status(HttpStatus.UNAUTHORIZED);
      res.send(null);
    }
  }

  @Put('myself')
  @ApiOperation({ description: 'Update user by current session' })
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
      return res.send(null);
    }

    const current = await this.userRepo.findOne({ where: { id }, loadRelationIds: true });

  }

  @Post()
  async addUser(
    @Body()
      user: UserInputSchema,
  ) {

    console.log(user)

  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'User id' })
  async updateUser(
    @Body()
      user: UserInputSchema,
    @Param('id')
      id: number
  ) {

    console.log(id, user)

  }

  @Get(":id")
  async item(
    @Param('id')
      id: number
  ) {
    return this.userRepo.findOne({ where: { id } });
  }

}
