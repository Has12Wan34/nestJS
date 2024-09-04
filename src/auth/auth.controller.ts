import { Post, Body, Controller, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

interface UserWithToken {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  token?: string;
}

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  @Post('register')
  async create(@Body() body: { name: string; email: string, password: string; }): Promise<UserWithToken> {
    const existingUser = await this.usersService.getUserByEmail(body.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const user = await this.usersService.createUser(body);
    const { password, ...result } = user;
    return result;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<UserWithToken> {
    const user = await this.usersService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    const { password, ...result } = user;
    return {...result, token: this.jwtService.sign(payload)};
  }
}
