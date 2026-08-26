import CheckoutProcess from '../src/js/CheckoutProcess.mjs';

describe('CheckoutProcess', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      'so-cart',
      JSON.stringify([
        { Id: '1', Name: 'Tent', FinalPrice: 100, quantity: 1 },
        { Id: '2', Name: 'Sleeping Bag', FinalPrice: 80, quantity: 2 },
      ]),
    );
  });

  test('calculates item subtotal, tax, shipping, and order total', () => {
    const checkout = new CheckoutProcess();
    const subtotal = checkout.calculateItemSubtotal();
    const totals = checkout.calculateOrderTotal();

    expect(subtotal).toBe(260);
    expect(totals.subtotal).toBe(260);
    expect(totals.tax).toBeCloseTo(15.6, 2);
    expect(totals.shipping).toBe(12);
    expect(totals.total).toBeCloseTo(287.6, 2);
  });

  test('packages cart items into checkout payload format', () => {
    const checkout = new CheckoutProcess();
    const items = JSON.parse(localStorage.getItem('so-cart'));
    expect(checkout.packageItems(items)).toEqual([
      { id: '1', name: 'Tent', price: 100, quantity: 1 },
      { id: '2', name: 'Sleeping Bag', price: 80, quantity: 2 },
    ]);
  });
});
