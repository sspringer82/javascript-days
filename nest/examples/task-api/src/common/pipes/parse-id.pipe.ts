// Eigene Pipe: Pfadparameter → positive ganze Zahl, sonst 400.
// Pipes transformieren und validieren, bevor der Handler läuft.

import {
  type ArgumentMetadata,
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    // #region 3.1: Umwandeln und prüfen
    const id = Number(value);
    if (!Number.isSafeInteger(id) || id < 1) {
      throw new BadRequestException(
        `${metadata.data ?? 'id'} muss eine positive ganze Zahl sein`,
      );
    }
    return id;
    // #live
    // return Number(value);
    // #endregion
  }
}
