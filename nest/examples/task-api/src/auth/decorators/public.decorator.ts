import { Reflector } from '@nestjs/core';

// @Public() an Klasse oder Handler: AuthGuard lässt den Request ohne Token durch
export const Public = Reflector.createDecorator<void, true>({
  transform: () => true,
});
