// Web Streams in Node.js und die Brücke zu Node Streams
// Start: node web-streams.js

import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';
import { text, json } from 'node:stream/consumers';

// TODO 1: Web Streams sind global – inkl. Compression und TextDecoder

// TODO 2: Brücke Node ⇄ Web mit Readable.toWeb / Readable.fromWeb

// TODO 3: stream/consumers – Streams bequem einsammeln (text, json, buffer)
