import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;
  let authService: AuthService;

  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) =>
        Promise.resolve({ id, email: 'aa@gmail.com', password: 'pass' }),
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'pass' }]),
      remove: (id: number) =>
        Promise.resolve({ id, email: 'aa@gmail.com', password: 'pass' }),
      update: (id: number, body: UpdateUserDto) =>
        Promise.resolve({
          id,
          email: 'email@gmail.com',
          password: 'pass',
          ...body,
        }),
    };
    fakeAuthService = {
      signup: (body: CreateUserDto) =>
        Promise.resolve({ id: 45, email: body.email, password: body.password }),
      signin: (body: CreateUserDto) =>
        Promise.resolve({ id: 45, email: body.email, password: body.password }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUserService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    userService = module.get(UsersService);
    authService = module.get(AuthService);

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user by id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('should throw an error', async () => {
    fakeUserService.findOne = () => Promise.resolve(undefined);
    const user = await controller.findUser('101');
    expect(user).toEqual(undefined);
  });

  it('should return user by email', async () => {
    const user = await controller.findAllUsers('emg@gmail.com');
    expect(user).toBeDefined();
    expect(user.length).toEqual(1);
    expect(user[0].email).toEqual('emg@gmail.com');
  });

  it('should be remove the user by id and return it', async () => {
    const user = await controller.deleteUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('should update the user by id and return it', async () => {
    const user = await controller.updateUser(1, {
      email: 'updated@gmail.com',
    } as UpdateUserDto);
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(user.email).toEqual('updated@gmail.com');
  });

  it('signin update session obj and return user', async () => {
    const session = { userId: -10 };
    const user = await controller.sigin(
      {
        email: 'email1@asd.com',
        password: '455',
      },
      session,
    );
    expect(user.id).toEqual(45);
    expect(session.userId).toEqual(45);
  });
});
