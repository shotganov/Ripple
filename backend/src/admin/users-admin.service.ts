import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { avatarUrl } from '../shared/paths';

@Injectable()
export class UsersAdminService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        tag: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(u => ({
      ...u,
      avatar: avatarUrl(u.avatar),
    }));
  }

  async setRole(id: number, role: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === role) return { message: 'Role unchanged' };

    await this.prisma.user.update({ where: { id }, data: { role } });
    return { message: 'Role updated' };
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === Role.ADMIN) {
      const adminCount = await this.prisma.user.count({ where: { role: Role.ADMIN } });
      if (adminCount <= 1) throw new BadRequestException('Cannot delete the last admin');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted' };
  }
}
