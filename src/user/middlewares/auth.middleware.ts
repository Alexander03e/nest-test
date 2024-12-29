import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ExpressRequest } from '@app/common/types/express.interface';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@app/user/user.service';
import { User } from '@app/user/entity/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, this.configService.get('JWT_SECRET'));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      req.user = await this.userService.findById(decode.id);

      next();
    } catch (e) {
      console.log(e);
      req.user = null;
      next();
    }
  }
}
