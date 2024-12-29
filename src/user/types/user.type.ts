import { User } from '@app/user/entity/user.entity';

export type UserType = Omit<User, 'hashPassword'>;
