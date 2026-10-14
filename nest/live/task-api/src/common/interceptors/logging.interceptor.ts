// Interceptor: Code vor UND nach dem Handler – hier Dauer pro Request.
// Läuft nach den Guards: abgewiesene Requests tauchen hier nicht auf.

import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { type Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // TODO 3.4: Zeit messen und strukturiert loggen
    return next.handle();
  }
}
