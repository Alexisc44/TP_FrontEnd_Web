import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const usersServiceMock = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }]
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should let the service generate the user ID', async () => {
    const expected = Object.assign(new User(1, 'Doe', 'Jane', 23, ''), {
      password: 'hashed-password',
    });
    jest.spyOn(service, 'create').mockResolvedValue(expected);

    await expect(controller.create({
      firstname: 'Jane',
      lastname: 'Doe',
      age: 23,
      password: 'password',
    })).resolves.toBe(expected);

    expect(service.create).toHaveBeenCalledWith(
      'Doe',
      'Jane',
      23,
      expect.stringMatching(/^\$2[aby]\$/),
    );
    expect(expected.id).toBe(1);
  });

  it('should exclude the password from serialized users', () => {
    const user = Object.assign(new User(1, 'Doe', 'Jane', 23, ''), {
      password: 'hashed-password',
    });

    expect(instanceToPlain(user)).not.toHaveProperty('password');
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const expected: User[] = [
        Object.assign(new User(1, 'Doe', 'John', 23, ''), {
          password: 'password',
        }),
      ];
      jest.spyOn(service, 'getAll').mockResolvedValue(expected);
      expect(await controller.getAll()).toBe(expected);
    });
  });

  describe('getById', () => {
    it('should return a single user, with the provided id', async () => {
      const expected = Object.assign(new User(1, 'Doe', 'John', 23, ''), {
        password: 'password',
      });
      jest.spyOn(service, 'getById').mockResolvedValue(expected);
      expect(await controller.getById('1')).toEqual(expected);
    });
  });
});