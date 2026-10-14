import { Controller, Get, Inject } from '@nestjs/common';
import type { DatabaseSync } from 'node:sqlite';
import { Public } from '../auth/decorators/public.decorator.js';
import { DATABASE } from '../database/database.module.js';

@Public()
@Controller('health')
export class HealthController {
  constructor(@Inject(DATABASE) private readonly db: DatabaseSync) {}

  @Get()
  check() {
    this.db.prepare('SELECT 1').get();
    return { status: 'ok', uptime: Math.round(process.uptime()) };
  }
}
