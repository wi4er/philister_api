import { Controller, Get, Req } from '@nestjs/common';
import { Context } from "@nestjs/graphql";

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(

    @Req() request: Request
  ): string {

    console.log(request['session']);

    if (request['session'].user) {
      request['session'].user.id = request['session'].user.id + 1;
    } else {
      request['session'].user = {
        id: 1
      };
    }

    return `Hello world ${request['session'].user.id}`;
  }
}
