import { Module } from '@nestjs/common';
import { SqliteTasksRepository } from './sqlite-tasks.repository.js';
import { TasksController } from './tasks.controller.js';
import { TasksRepository } from './tasks.repository.js';
import { TasksService } from './tasks.service.js';

@Module({
  // #region 1.1: Controller registrieren
  controllers: [TasksController],
  // #endregion
  providers: [
    // #region 1.1: Service registrieren
    TasksService,
    // #endregion
    // #region 1.2: Port an Adapter binden (Custom Provider)
    { provide: TasksRepository, useClass: SqliteTasksRepository },
    // #endregion
  ],
})
export class TasksModule {}
