export class Cart {
  #items = new Map();
  #ttl;
  #onExpire;
  #timer;

  constructor({ ttl = 15 * 60_000, onExpire = () => {} } = {}) {
    this.#ttl = ttl;
    this.#onExpire = onExpire;
  }

  add(sku, price, quantity = 1) {
    if (quantity <= 0) throw new RangeError('quantity muss > 0 sein');

    const item = this.#items.get(sku) ?? { sku, price, quantity: 0 };
    item.quantity += quantity;
    this.#items.set(sku, item);
    this.#resetTimer();
  }

  get total() {
    let sum = 0;
    for (const { price, quantity } of this.#items.values()) sum += price * quantity;
    return sum;
  }

  async checkout(paymentService) {
    if (this.#items.size === 0) throw new Error('Warenkorb ist leer');

    const receipt = await paymentService.charge(this.total);
    this.#clear();
    return receipt;
  }

  toJSON() {
    return { items: [...this.#items.values()], total: this.total };
  }

  #resetTimer() {
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => {
      this.#clear();
      this.#onExpire();
    }, this.#ttl);
    // Der Timer soll den Prozess nicht am Leben halten
    this.#timer.unref?.();
  }

  #clear() {
    clearTimeout(this.#timer);
    this.#items.clear();
  }
}
