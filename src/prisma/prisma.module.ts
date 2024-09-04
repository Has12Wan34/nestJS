import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersService } from '../users/users.service'

@Module({
  imports: [UsersService],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
