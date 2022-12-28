import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Put('/:id')
  updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
