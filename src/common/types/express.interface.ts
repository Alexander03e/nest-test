import { Request } from 'express';
import { User } from '@app/user/entity/user.entity';

export interface ExpressRequest extends Request {
  user?: User;
}
