// Abstraktion + Implementierung: im Test durch einen schnellen Fake ersetzbar.
// scrypt aus node:crypto – keine native Dependency wie bcrypt nötig.

import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

export abstract class PasswordHasher {
  abstract hash(password: string): Promise<string>;
  abstract verify(password: string, hash: string): Promise<boolean>;
}

@Injectable()
export class ScryptPasswordHasher extends PasswordHasher {
  async hash(password: string) {
    const salt = randomBytes(16);
    const key = await scryptAsync(password, salt, 64);
    return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
  }

  async verify(password: string, hash: string) {
    const [algorithm, salt, key] = hash.split('$');
    if (algorithm !== 'scrypt' || !salt || !key) return false;
    const expected = Buffer.from(key, 'base64');
    const actual = await scryptAsync(
      password,
      Buffer.from(salt, 'base64'),
      expected.length,
    );
    return timingSafeEqual(actual, expected);
  }
}
