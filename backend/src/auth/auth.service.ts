import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';
import { avatarUrl, coverUrl } from 'src/shared/paths';

const publicUserSelect = {
  id: true,
  username: true,
  tag: true,
  avatar: true,
  coverImage: true,
  bio: true,
  role: true,
} as const;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async loadProfile(id: number) {
    const [user, followersCount, followingCount] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id },
        select: publicUserSelect,
      }),
      this.prisma.follow.count({ where: { followingId: id } }),
      this.prisma.follow.count({ where: { followerId: id } }),
    ]);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return {
      ...user,
      avatar: avatarUrl(user.avatar),
      coverImage: coverUrl(user.coverImage),
      followersCount,
      followingCount,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { tag: loginDto.tag },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const isPasswordValid = (await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    )) as boolean;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const profile = await this.loadProfile(user.id);
    const payload = { userId: user.id, role: user.role };

    return {
      token: await this.jwtService.signAsync(payload),
      user: profile,
    };
  }

  async register(data: CreateUserDto) {
    const tag = data.tag.trim();

    const existing = await this.prisma.user.findUnique({
      where: { tag },
    });

    if (existing) {
      throw new ConflictException('Такой логин уже занят');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    const username = tag;

    const created = await this.prisma.user.create({
      data: {
        username,
        tag,
        role: Role.USER,
        passwordHash,
        avatar: data.avatar?.trim() || 'default.jpg',
        bio: data.bio?.trim(),
      },
      select: { id: true, role: true },
    });

    const profile = await this.loadProfile(created.id);
    const payload = { userId: created.id, role: created.role };

    return {
      token: await this.jwtService.signAsync(payload),
      user: profile,
    };
  }
}
