import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';

const readableStream = createReadStream('input.txt', { encoding: 'utf8' });
const writableStream = createWriteStream('output.txt');

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase()); // Wandelt Text in Großbuchstaben um
  },
});

readableStream.pipe(transformStream).pipe(writableStream);