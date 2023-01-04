import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const Required = createParamDecorator(
  async (property: string | number | symbol, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;
    const res = ctx.switchToHttp().getResponse();

    if (!headers[property]) {
      res.status(400);
      res.send({ message: 'login expected!' });
      res.end();
    }
  }
);
