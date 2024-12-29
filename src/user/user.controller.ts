import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto, LoginUserDto } from '@app/user/dto/create-user.dto';
import { IUserResponse } from '@app/user/types/user-response.interface';

import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guards';
import { UpdateUserDto } from '@app/user/dto/update-user.dto';

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

  @Get('me')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: any) {
    return this.userService.buildResponse(user);
  }

  @Put('update')
  @UseGuards(AuthGuard)
  async updateCurrentUser(@User('id') id: number, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }
}
