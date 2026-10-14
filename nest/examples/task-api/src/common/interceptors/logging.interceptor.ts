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
    // #region 3.4: Zeit messen und strukturiert loggen
    const { method, url } = context.switchToHttp().getRequest<Request>();
    const handler = `${context.getClass().name}.${context.getHandler().name}`;
    const start = performance.now();
    const durationMs = () => Math.round(performance.now() - start);

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.log(`${method} ${url}`, { handler, ms: durationMs() }),
        error: (error: Error) =>
          this.logger.warn(`${method} ${url} fehlgeschlagen`, {
            handler,
            ms: durationMs(),
            error: error.name,
          }),
      }),
    );
    // #live
    // return next.handle();
    // #endregion
  }
}
