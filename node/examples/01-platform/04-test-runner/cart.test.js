// Start: node --test                               (findet *.test.js automatisch)
//        node --test --watch
//        node --test --experimental-test-coverage
//        node --test --test-update-snapshots         (Snapshots neu schreiben)
//        node --test --test-reporter=spec --test-name-pattern="TTL"

import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { Cart } from './cart.js';

describe('Cart', () => {
  // #region 1: describe/it und node:assert
  it('berechnet die Summe', () => {
    const cart = new Cart();
    cart.add('book', 20, 2);
    cart.add('pen', 2.5);

    assert.equal(cart.total, 42.5);
  });

  it('lehnt ungültige Mengen ab', () => {
    assert.throws(() => new Cart().add('book', 20, 0), RangeError);
  });
  // #endregion

  // #region 2: Async-Tests und Mock-Funktionen
  it('belastet den Payment-Service beim Checkout', async () => {
    const charge = mock.fn(async (amount) => ({ id: 'tx-1', amount }));
    const cart = new Cart();
    cart.add('book', 20);

    const receipt = await cart.checkout({ charge });

    assert.equal(charge.mock.callCount(), 1);
    assert.deepEqual(charge.mock.calls[0].arguments, [20]);
    assert.deepEqual(receipt, { id: 'tx-1', amount: 20 });
    assert.equal(cart.total, 0);
  });

  it('wirft bei leerem Warenkorb', async () => {
    await assert.rejects(new Cart().checkout({ charge: mock.fn() }), /leer/);
  });
  // #endregion

  // #region 3: Mock Timers – Zeit kontrollieren statt warten
  it('leert den Warenkorb nach Ablauf der TTL', (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const onExpire = t.mock.fn();
    const cart = new Cart({ ttl: 1000, onExpire });
    cart.add('book', 20);

    t.mock.timers.tick(999);
    assert.equal(onExpire.mock.callCount(), 0);

    t.mock.timers.tick(1);
    assert.equal(onExpire.mock.callCount(), 1);
    assert.equal(cart.total, 0);
  });
  // #endregion

  // #region 4: Snapshot-Tests
  it('serialisiert den Warenkorb stabil', (t) => {
    const cart = new Cart();
    cart.add('book', 20, 2);
    cart.add('pen', 2.5);

    t.assert.snapshot(cart.toJSON());
  });
  // #endregion
});
