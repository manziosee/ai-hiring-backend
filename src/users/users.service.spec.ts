import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { createMockPrismaService, MockPrismaService } from '../test/prisma-mock';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: MockPrismaService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    fullName: 'Test User',
    role: UserRole.CANDIDATE,
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithProfile = {
    ...mockUser,
    candidateProfile: {
      id: '1',
      userId: '1',
      name: 'Test User',
      skills: ['JavaScript', 'TypeScript'],
      yearsExp: 3,
      resumeUrl: 'https://example.com/resume.pdf',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  beforeEach(async () => {
    prismaService = createMockPrismaService();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user with profile when found', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUserWithProfile);

      const result = await service.findOne('1');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { candidateProfile: true },
      });
      expect(result).toEqual(mockUserWithProfile);
    });

    it('should throw NotFoundException when user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { candidateProfile: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return all users with profiles', async () => {
      const mockUsers = [mockUserWithProfile];
      prismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        include: { candidateProfile: true },
      });
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users found', async () => {
      prismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    const updateUserDto = {
      fullName: 'Updated Name',
      email: 'updated@example.com',
    };

    it('should successfully update user', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateUserDto,
        include: { candidateProfile: true },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully delete user', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove('1');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      expect(prismaService.user.delete).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});
