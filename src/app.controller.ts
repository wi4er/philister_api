import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request } from "express";

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(
    @Req() request: Request,
  ) {
    if (request['session'].user) {
      request['session'].user.id = request['session'].user.id + 1;
    } else {
      request['session'].user = {
        id: 1
      };

    }
    return `"Hello world ${request['session'].user.id}"`;
  }
}
