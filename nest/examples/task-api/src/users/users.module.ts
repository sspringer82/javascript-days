import { Module } from '@nestjs/common';
import { SqliteUsersRepository } from './sqlite-users.repository.js';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UsersRepository, useClass: SqliteUsersRepository },
  ],
  // Öffentliche API des Moduls: nur der Service, nie das Repository
  exports: [UsersService],
})
export class UsersModule {}
