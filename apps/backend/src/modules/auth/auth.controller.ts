import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string; },
  ) {
    console.log('Login request received:', body);
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }

    const loggedUser = await this.authService.login(body.email, body.password);

    return {
      message: 'Login successful',
      user: loggedUser,
      token: Math.random().toString(36).substring(2, 15)
    }
  }
}
