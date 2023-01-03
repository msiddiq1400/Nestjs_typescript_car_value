import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    userService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      createUser: (body: CreateUserDto) => {
        const user = { id: Math.floor(Math.random() * 999999), ...body };
        users.push(user);
        return Promise.resolve(user as User);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: userService },
      ],
    }).compile();
    authService = module.get(AuthService);
  });

  it('can create an instance of auth servuce', async () => {
    expect(authService).toBeDefined();
  });

  it('create new user with salted and hash password', async () => {
    const user = await authService.signup({
      email: 'em1@gmail.com',
      password: 'asdf',
    });
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw error if signs up with email already in use', async () => {
    await authService.signup({ email: 'asd@gmail.com', password: 'pass' });
    await expect(
      authService.signup({ email: 'asd@gmail.com', password: 'pass' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('if not user found, throw an error', async () => {
    await expect(
      authService.signin({ email: 'asd454@gmail.com', password: 'asd3' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throw error if password does not match', async () => {
    await authService.signup({ email: 'sid45@gmail.com', password: 'sid45' });
    await expect(
      authService.signin({
        email: 'sid45@gmail.com',
        password: 'sid457', //correct password is sid45
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('signin in successfully if correct password', async () => {
    await authService.signup({ email: 'sid456@gmail.com', password: 'sid456' });
    const user = await authService.signin({
      email: 'sid456@gmail.com',
      password: 'sid456', //correct is sid456
    });
    expect(user).toBeDefined();
  });
});
