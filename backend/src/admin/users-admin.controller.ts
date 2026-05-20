import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersAdminService } from './users-admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

class SetRoleDto {
  @IsEnum(Role)
  role: Role;
}

@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersAdminController {
  constructor(private readonly service: UsersAdminService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/role')
  setRole(@Param('id', ParseIntPipe) id: number, @Body() body: SetRoleDto) {
    return this.service.setRole(id, body.role);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
