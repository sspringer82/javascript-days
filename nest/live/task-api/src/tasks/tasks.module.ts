import { Module } from '@nestjs/common';
import { SqliteTasksRepository } from './sqlite-tasks.repository.js';
import { TasksController } from './tasks.controller.js';
import { TasksRepository } from './tasks.repository.js';
import { TasksService } from './tasks.service.js';

@Module({
  // TODO 1.1: Controller registrieren
  providers: [
    // TODO 1.1: Service registrieren
    // TODO 1.2: Port an Adapter binden (Custom Provider)
  ],
})
export class TasksModule {}
