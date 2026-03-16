const {readFile} = require('node:fs/promises');

const data = await readFile('input.txt', 'utf-8');

console.log(data);