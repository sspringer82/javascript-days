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
    // TODO 3.1: Umwandeln und prüfen
    return Number(value);
  }
}
