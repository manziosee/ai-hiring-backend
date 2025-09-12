import { Controller, Post, Body, UseGuards, Request, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RateLimit } from './decorators/rate-limit.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(RateLimitGuard)
  @RateLimit(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'jwt_token_here',
        user: { id: 'user_id', email: 'user@example.com', role: 'CANDIDATE' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  refresh(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiQuery({ name: 'token', description: 'Verification token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('linkedin')
  @ApiOperation({ summary: 'LinkedIn OAuth login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'LinkedIn authorization code' },
        redirectUri: { type: 'string', description: 'Redirect URI' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'LinkedIn login successful' })
  @ApiResponse({ status: 400, description: 'Invalid LinkedIn code' })
  linkedinAuth(@Body() body: { code: string; redirectUri: string }) {
    return this.authService.linkedinAuth(body.code, body.redirectUri);
  }
}
