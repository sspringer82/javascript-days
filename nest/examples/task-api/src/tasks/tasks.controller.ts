// Controller: übersetzt HTTP in Service-Aufrufe – keine Fachlogik hier.

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ParseIdPipe } from '../common/pipes/parse-id.pipe.js';
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskResponseSchema,
  updateTaskSchema,
  type CreateTaskInput,
  type ListTasksQuery,
  type UpdateTaskInput,
} from './task.schemas.js';
import { TasksService } from './tasks.service.js';

@Controller('tasks')
@SerializeOptions({ schema: taskResponseSchema })
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query({ schema: listTasksQuerySchema }) query: ListTasksQuery,
  ) {
    return this.tasksService.list(user.id, query);
  }

  // #region 1.3: Lesen, anlegen, ändern, löschen
  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id', ParseIdPipe) id: number) {
    return this.tasksService.get(user.id, id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body({ schema: createTaskSchema }) input: CreateTaskInput,
  ) {
    return this.tasksService.create(user.id, input);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIdPipe) id: number,
    @Body({ schema: updateTaskSchema }) changes: UpdateTaskInput,
  ) {
    return this.tasksService.update(user.id, id, changes);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: AuthUser, @Param('id', ParseIdPipe) id: number) {
    return this.tasksService.remove(user.id, id);
  }
  // #endregion
}
