import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MESSAGES } from '../../common/constants/messages';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PRACTICE_ADMIN')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return {
      message: MESSAGES.USER.CREATED,
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('SUPER_ADMIN', 'PRACTICE_ADMIN')
  @Permissions('FULL_ACCESS')
  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    const { items, meta } = await this.userService.findAll(pagination);
    return {
      message: MESSAGES.USER.CREATED,
      data: items,
      meta,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    const found = await this.userService.findById(user.sub);
    return {
      message: MESSAGES.USER.PROFILE,
      data: found,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    const updated = await this.userService.update(user.sub, dto);
    return {
      message: MESSAGES.USER.PROFILE_UPDATED,
      data: updated,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PRACTICE_ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return {
      message: MESSAGES.USER.PROFILE,
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'PRACTICE_ADMIN')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(id, dto);
    return {
      message: MESSAGES.USER.UPDATED,
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.userService.softDelete(id);
    return {
      message: MESSAGES.USER.DELETED,
      data: {},
    };
  }
}

