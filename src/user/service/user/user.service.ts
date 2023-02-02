import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EncodeService } from '../encode/encode.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private encodeService: EncodeService,
  ) {

  }

  /**
   *
   */
  async findByLogin(login: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { login } });

    if (
      !user
      || user.hash !== this.encodeService.toSha256(password)
    ) return null;

    return user;
  }

  async findByContact(
    contact: string,
    value: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({
      relations: { contact: { contact: true } },
      where: { contact: { contact: {id: contact }} },
    });

    if (
      !user
      || user.hash !== this.encodeService.toSha256(password)
    ) return null;

    return user;
  }

  /**
   *
   */
  async createByLogin(login: string, password: string): Promise<UserEntity> {

    if (password.length < 8) {
      const err = new Error();
      err['message'] = 'Password length at least 8 characters required!';
      err['field'] = 'password';

      throw err;
    }

    const user = new UserEntity();

    user.login = login;
    user.hash = this.encodeService.toSha256(password);
    await user.save();

    return user;
  }

  /**
   *
   */
  async deleteUser(id: number[]): Promise<number[]> {
    const result = [];
    const list = await this.userRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.userRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
