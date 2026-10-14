// Gleiches Experiment in CommonJS
// Start: node order.cjs

console.log('1 sync');

setTimeout(() => console.log('5 timeout'), 0);
setImmediate(() => console.log('6 immediate'));

Promise.resolve().then(() => console.log('4 microtask (promise)'));
process.nextTick(() => console.log('3 nextTick'));

console.log('2 sync');
