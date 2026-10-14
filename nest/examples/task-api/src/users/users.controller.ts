import { Controller, Get, SerializeOptions } from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { userResponseSchema } from './user.schemas.js';
import { UsersService } from './users.service.js';

@Controller('users')
@SerializeOptions({ schema: userResponseSchema })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.usersService.findById(user.id);
  }

  // #region 3.3: Nur für Admins
  @Roles(['admin'])
  // #endregion
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
