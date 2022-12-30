import { Injectable } from '@nestjs/common';
import { UserEntity } from "../../model/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EncodeService } from "../encode/encode.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private encodeService: EncodeService,
  ) {

  }

  async findByPassword(login: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { login } });

    if (
      !user
      || user.hash !== this.encodeService.toSha256(password)
    ) return null;

    return user;
  }

  async createByPassword(login: string, password: string): Promise<UserEntity> {
    const user = new UserEntity();

    user.login = login;
    user.hash = this.encodeService.toSha256(password);
    await user.save();

    return user;
  }

}
