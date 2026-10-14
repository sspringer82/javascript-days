import { AsyncLocalStorage } from 'node:async_hooks';

// Hält pro Request { requestId } – überall abrufbar, ohne Parameter durchzureichen
export const requestContext = new AsyncLocalStorage();
