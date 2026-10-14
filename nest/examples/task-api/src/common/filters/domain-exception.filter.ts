// Übersetzt DomainError → HTTP-Antwort. Alle anderen Fehler behandelt
// weiterhin Nest selbst (HttpException → Status, Rest → 500 ohne Interna).

import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DomainError } from '../errors/domain-errors.js';

const statusByCode: Record<string, HttpStatus> = {
  NOT_FOUND: HttpStatus.NOT_FOUND,
  CONFLICT: HttpStatus.CONFLICT,
  INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
};

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter<DomainError> {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(error: DomainError, host: ArgumentsHost) {
    // #region 3.5: Fehlercode auf Status abbilden und antworten
    const { httpAdapter } = this.adapterHost;
    const statusCode = statusByCode[error.code] ?? HttpStatus.BAD_REQUEST;

    httpAdapter.reply(
      host.switchToHttp().getResponse(),
      { statusCode, errorCode: error.code, message: error.message },
      statusCode,
    );
    // #live
    // throw error;
    // #endregion
  }
}
