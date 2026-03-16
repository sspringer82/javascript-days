import { EventEmitter } from 'node:events';

const myEmitter = new EventEmitter();

myEmitter.on('message', (data) => {
    console.log(`Received message: ${data}`);
});

myEmitter.once('message', (data) => {
    console.log(`Received message once: ${data}`);
});

myEmitter.emit('message', 'Hello, World!');
myEmitter.emit('message', 'Hello again!');  