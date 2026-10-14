// Web Streams in Node.js und die Brücke zu Node Streams
// Start: node web-streams.js

import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';
import { text, json } from 'node:stream/consumers';

// #region 1: Web Streams sind global – inkl. Compression und TextDecoder
const source = new ReadableStream({
  start(controller) {
    for (const word of ['state', 'of', 'the', 'art', 'node']) controller.enqueue(word + ' ');
    controller.close();
  },
});

const upper = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const compressed = source
  .pipeThrough(upper)
  .pipeThrough(new TextEncoderStream())
  .pipeThrough(new CompressionStream('gzip'));

const roundtrip = compressed
  .pipeThrough(new DecompressionStream('gzip'))
  .pipeThrough(new TextDecoderStream());

console.log('Web Streams:', await text(roundtrip));
// #endregion

// #region 2: Brücke Node ⇄ Web mit Readable.toWeb / Readable.fromWeb
const webStream = Readable.toWeb(createReadStream(import.meta.filename));
const response = new Response(webStream); // z. B. als fetch-Response zurückgeben
console.log('Bytes über Response:', (await response.arrayBuffer()).byteLength);

const nodeStream = Readable.fromWeb(new Response('Hallo aus dem Web').body);
console.log('Zurück als Node Stream:', await text(nodeStream));
// #endregion

// #region 3: stream/consumers – Streams bequem einsammeln (text, json, buffer)
const data = await json(Readable.from([Buffer.from('{"talk":'), Buffer.from('"streams"}')]));
console.log('JSON aus Stream:', data);
// #endregion
