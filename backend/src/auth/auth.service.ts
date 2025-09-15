import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const verificationToken = Math.random().toString(36).substring(2, 15);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        fullName: registerDto.fullName,
        role: registerDto.role,
        emailVerified: false,
        verificationToken,
      },
    });

    // If user is candidate, create candidate profile
    if (registerDto.role === 'CANDIDATE' && registerDto.candidateData) {
      await this.prisma.candidate.create({
        data: {
          name: registerDto.fullName,
          email: registerDto.email,
          phone: registerDto.candidateData.phone,
          location: registerDto.candidateData.location,
          skills: registerDto.candidateData.skills,
          yearsExp: registerDto.candidateData.yearsExp,
          userId: user.id,
        },
      });
    }

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.fullName,
      verificationToken,
    );

    return {
      message:
        'Registration successful! Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        emailVerified: false,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async validateUser(payload: any) {
    return await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
  }

  async refreshToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(userId: string) {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return a success message
    return { message: 'Successfully logged out' };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    return { message: 'Email verified successfully! You can now log in.' };
  }

  async linkedinAuth(code: string, redirectUri: string) {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch(
        'https://www.linkedin.com/oauth/v2/accessToken',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: process.env.LINKEDIN_CLIENT_ID || '',
            client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
          } as Record<string, string>),
        },
      );

      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token) {
        throw new UnauthorizedException('Failed to get LinkedIn access token');
      }

      // Get user profile
      const profileResponse = await fetch(
        'https://api.linkedin.com/v2/people/~:(id,firstName,lastName,emailAddress)',
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        },
      );

      const profile = await profileResponse.json();

      if (!profile.emailAddress) {
        throw new UnauthorizedException('Failed to get LinkedIn profile');
      }

      // Check if user exists
      let user = await this.prisma.user.findUnique({
        where: { email: profile.emailAddress },
      });

      if (!user) {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email: profile.emailAddress,
            fullName: `${profile.firstName.localized.en_US} ${profile.lastName.localized.en_US}`,
            role: 'CANDIDATE',
            emailVerified: true,
            linkedinId: profile.id,
          },
        });
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('LinkedIn authentication failed');
    }
  }
}
