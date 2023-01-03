import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/session/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/session/signout')
  signOut(@Session() session: any) {
    session.userId = null;
    return 'user signout success';
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session) {
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async sigin(@Body() body: CreateUserDto, @Session() session) {
    const user = await this.authService.signin(body);
    session.userId = user.id;
    return user;
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
