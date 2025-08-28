import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    fullName: 'Test User',
    role: UserRole.CANDIDATE,
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      role: UserRole.CANDIDATE,
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashedPassword';
      const accessToken = 'jwt-token';

      prismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      prismaService.user.create.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(accessToken);

      const result = await service.register(registerDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...registerDto,
          password: hashedPassword,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          fullName: mockUser.fullName,
          role: mockUser.role,
        },
        access_token: accessToken,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      const accessToken = 'jwt-token';

      prismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue(accessToken);

      const result = await service.login(loginDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          fullName: mockUser.fullName,
          role: mockUser.role,
        },
        access_token: accessToken,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser('1');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { candidateProfile: true },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('1');

      expect(result).toBeNull();
    });
  });
});
