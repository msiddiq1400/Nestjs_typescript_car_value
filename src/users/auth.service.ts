import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(body: CreateUserDto) {
    const { email, password } = body;
    //check existing user
    const user = await this.userService.find(email);
    if (user.length > 0) {
      throw new BadRequestException('user already exists');
    }
    //convert buffer 1 and 0 to hex string letter and number
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;
    //save and return the user
    return await this.userService.createUser({ email, password: result });
  }

  async signin(body: CreateUserDto) {
    const { email, password } = body;
    //check existing user
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new BadRequestException('user does not exists');
    }
    const userPassword = user.password;
    const [salt, storedHash] = userPassword.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash != hash.toString('hex')) {
      throw new BadRequestException('Incorrect Password');
    } else {
      return user;
    }
  }
}
