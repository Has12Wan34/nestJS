import { Post, Body, Controller, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  async create(@Body() body: { name: string; email: string, password: string; }): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersService.getUserByEmail(body.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const user = await this.usersService.createUser(body);
    const { password, ...result } = user;
    return result;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password, ...result } = user;
    return result;
  }
}
