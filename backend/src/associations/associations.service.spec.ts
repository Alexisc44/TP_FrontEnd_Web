import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { UsersService } from '../users/users.service';
import { Association } from './association.entity';
import { AssociationsService } from './associations.service';

describe('AssociationsService', () => {
  let service: AssociationsService;
  const associations: Association[] = [
    {
      id: 1,
      name: 'Chess Club',
      users: [
        {
          id: 2,
          lastname: 'Doe',
          firstname: 'Jane',
          age: 30,
          password: 'secret',
        },
        {
          id: 3,
          lastname: 'Smith',
          firstname: 'John',
          age: 28,
          password: 'secret',
        },
      ],
    },
  ];
  const roles: Role[] = [
    {
      id: 1,
      name: 'President',
      user: associations[0].users[0],
      association: associations[0],
    },
  ];

  beforeEach(async () => {
    const associationRepository = {
      find: jest.fn().mockResolvedValue(associations),
    };
    const rolesRepository = {
      find: jest.fn().mockResolvedValue(roles),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssociationsService,
        { provide: UsersService, useValue: {} },
        {
          provide: getRepositoryToken(Association),
          useValue: associationRepository as unknown as Repository<Association>,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: rolesRepository as unknown as Repository<Role>,
        },
      ],
    }).compile();

    service = module.get<AssociationsService>(AssociationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns member details and roles without exposing user passwords', async () => {
    await expect(service.getAllDTO()).resolves.toEqual([
      {
        name: 'Chess Club',
        members: [
          {
            name: 'Doe',
            firstname: 'Jane',
            age: 30,
            role: 'President',
          },
          {
            name: 'Smith',
            firstname: 'John',
            age: 28,
            role: null,
          },
        ],
      },
    ]);
  });
});
