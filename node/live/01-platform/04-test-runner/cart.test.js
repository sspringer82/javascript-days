// Start: node --test                               (findet *.test.js automatisch)
//        node --test --watch
//        node --test --experimental-test-coverage
//        node --test --test-update-snapshots         (Snapshots neu schreiben)
//        node --test --test-reporter=spec --test-name-pattern="TTL"

import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { Cart } from './cart.js';

describe('Cart', () => {
  // TODO 1: describe/it und node:assert

  // TODO 2: Async-Tests und Mock-Funktionen

  // TODO 3: Mock Timers – Zeit kontrollieren statt warten

  // TODO 4: Snapshot-Tests
});
