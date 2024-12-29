import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto, LoginUserDto } from '@app/user/dto/create-user.dto';
import { IUserResponse } from '@app/user/types/user-response.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') user: CreateUserDto): Promise<IUserResponse> {
    const newUser = await this.userService.createUser(user);

    return this.userService.buildResponse(newUser);
  }

  @Post('login')
  async login(@Body('user') user: LoginUserDto): Promise<IUserResponse> {
    return await this.userService.verifyUser(user);
  }
}
