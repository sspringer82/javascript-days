import { Reflector } from '@nestjs/core';
import type { Role } from '../../users/user.js';

// @Roles(['admin']) – typsicher, Key und Lesen über den Reflector inklusive
export const Roles = Reflector.createDecorator<Role[]>();
