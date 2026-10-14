import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { userResponseSchema } from '../users/user.schemas.js';
import { credentialsSchema, type Credentials } from './auth.schemas.js';
import { AuthService } from './auth.service.js';
import { Public } from './decorators/public.decorator.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @SerializeOptions({ schema: userResponseSchema })
  register(@Body({ schema: credentialsSchema }) credentials: Credentials) {
    return this.authService.register(credentials);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body({ schema: credentialsSchema }) credentials: Credentials) {
    return this.authService.signIn(credentials);
  }
}
