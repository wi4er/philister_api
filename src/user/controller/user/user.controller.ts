import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../model/user.entity";
import { Repository } from "typeorm";

@Controller('user')
export class UserController {

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
  }

  @Get()
  async list() {
    return this.userRepo.find()
  }

  @Get(":id")
  async item(
    @Param('id')
      id: number
  ) {
    return this.userRepo.findOne({where: {id}});
  }
}
