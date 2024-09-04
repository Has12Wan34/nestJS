import { Body, Controller, Get, Param, Post, Put, Delete, ParseIntPipe, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('api/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  async getUsers(): Promise<Array<Omit<User, 'password'>>> {
    const users = await this.usersService.getUsers();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<Omit<User, 'password'> | null> {
    return this.usersService.getUserById(id).then(user => {
      if (!user) {
        return null;
      }
      const { password, ...result } = user;
      return result;
    });
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() body: { name?: string; email?: string }): Promise<Omit<User | null, 'password'>> {
    const user = await this.usersService.updateUser(id, body);
    if (!user) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.deleteUser(id);
    const { password, ...result } = user;
    return result;
  }
}
