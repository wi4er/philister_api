import { Injectable } from '@nestjs/common';
import { UserEntity } from "../../model/user.entity";
import { Request, Response } from "express";

@Injectable()
export class SessionService {

  open(
    req: Request,
    user: UserEntity
  ) {
    req['session']['user'] = { id: user.id };
  }
}
