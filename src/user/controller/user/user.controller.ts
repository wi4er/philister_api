import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../model/user.entity";
import { EntityManager, Repository } from "typeorm";
import { Request, Response } from "express";
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { UserInputSchema } from "../../schema/user-input.schema";
import { UserService } from "../../service/user/user.service";
import { UserUpdateOperation } from "../../operation/user-update.operation";
import { UserSchema } from "../../schema/user.schema";

@ApiTags('User object')
@Controller('user')
export class UserController {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private userService: UserService
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
      res.json(await this.userRepo.findOne({ where: { id }, loadRelationIds: true }));
    } else {
      res.status(HttpStatus.UNAUTHORIZED);
      res.send(null);
    }
  }

  @Put('myself')
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

  @Delete(':id')
  async deleteUser(
    @Param('id')
      id: number
  ) {
    return this.userService.deleteUser([ id ]);
  }

}
