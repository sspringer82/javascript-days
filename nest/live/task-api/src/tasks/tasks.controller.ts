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

  // TODO 1.3: Lesen, anlegen, ändern, löschen
}
