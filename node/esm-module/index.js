import http from 'node:http';

import _ from 'lodash';

import {requestHandler} from './request-handler.js';

const server = http.createServer(requestHandler);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
}); 


const numbers = new Array(5);
_.fill(numbers, 7);

console.log(numbers); // [7, 7, 7, 7, 7]