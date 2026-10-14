import { type ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ParseIdPipe } from './parse-id.pipe.js';

describe('ParseIdPipe', () => {
  const pipe = new ParseIdPipe();
  const metadata: ArgumentMetadata = { type: 'param', data: 'id' };

  it('wandelt in eine Zahl um', () => {
    expect(pipe.transform('42', metadata)).toBe(42);
  });

  it.each(['abc', '0', '-1', '1.5', ''])('lehnt "%s" ab', (value) => {
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });
});
