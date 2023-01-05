import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request } from "express";

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(
    @Req() request: Request,
  ) {
    // if (request['session'].user) {
    //   request['session'].data = request['session'].data + 1;
    // } else {
    //   request['session'].data = 1;
    //
    // }

    return `"Hello world ${request['session'].data}"`;
  }
}
