import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const userService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      createUser: (body: CreateUserDto) => {
        const { email, password } = body;
        return Promise.resolve({ id: 1, email, password } as User);
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
});
