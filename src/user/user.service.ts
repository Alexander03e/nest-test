import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '@app/user/dto/create-user.dto';
import { User } from '@app/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { IUserResponse } from '@app/user/types/user-response.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async verifyUser(user: LoginUserDto): Promise<IUserResponse> {
    const userByEmail = await this.userRepository.findOneBy({
      email: user.email,
    });

    if (!userByEmail) {
      throw new HttpException(
        'Такого пользователя не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!(await bcrypt.compare(user.password, userByEmail.password))) {
      throw new HttpException('Пароль не верный', HttpStatus.UNAUTHORIZED);
    }

    return this.buildResponse(userByEmail);
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: user.email }, { username: user.username }],
    });

    if (existingUser) {
      if (existingUser.email === user.email) {
        throw new HttpException(
          'Такой email уже зарегистрирован.',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      if (existingUser.username === user.username) {
        throw new HttpException(
          'Такое имя пользователя уже есть.',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const newUser = new User();
    Object.assign(newUser, user);

    return await this.userRepository.save(newUser);
  }

  private generateJwt(user: User): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      this.configService.get('JWT_SECRET'),
    );
  }

  buildResponse(user: User): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
