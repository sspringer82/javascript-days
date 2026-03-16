import { readFileSync } from "node:fs";

console.log('1');
const data = readFileSync('input.txt', 'utf-8');
console.log('2');
console.log(data);
console.log('3');

import { readFile } from "node:fs";


console.log('11');
readFile('input.txt', 'utf-8', (error, data) => {
    if (error) {
        throw error;
    }
    console.log(data);
})
console.log('22');

import { readFile as promisedReadFile } from "node:fs/promises";

console.log('111');
promisedReadFile('input.txt', 'utf-8').then(data => {
    return data.toUpperCase();
}).then(data => {
    console.log(data);
}).catch(error => {
    console.error(error);
});
console.log('222');


async function readAndPrintFile() {
    try {
        const data = await promisedReadFile('input.txt', 'utf-8');
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

console.log('a');
readAndPrintFile();
console.log('b');

console.log('aa');
const asyncData = await promisedReadFile('input.txt', 'utf-8');
console.log(asyncData);
console.log('bb');