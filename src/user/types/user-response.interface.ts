import { UserType } from '@app/user/types/user.type';

export interface IUserResponse {
  user: UserType & {
    token: string;
  };
}
