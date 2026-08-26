import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

export default class CheckoutProcess {
  constructor(key = 'so-cart') {
    this.key = key;
  }

  getItems() {
    return getLocalStorage(this.key) || [];
  }

  itemCount() {
    return this.getItems().reduce((count, item) => {
      const quantity = Number(item.quantity ?? 1);
      return count + quantity;
    }, 0);
  }

  packageItems(items = this.getItems()) {
    return items.map((item) => ({
      id: item.Id || item.id,
      name: item.Name || item.name || item.NameWithoutBrand,
      price: Number(item.FinalPrice ?? item.price ?? 0),
      quantity: Number(item.quantity ?? 1),
    }));
  }

  calculateItemSubtotal() {
    const subtotal = this.getItems().reduce((total, item) => {
      const price = Number(item.FinalPrice ?? item.price ?? 0);
      const quantity = Number(item.quantity ?? 1);
      return total + price * quantity;
    }, 0);

    this.subtotal = subtotal;
    return subtotal;
  }

  calculateOrderTotal() {
    const subtotal = this.calculateItemSubtotal();
    const tax = subtotal * 0.06;
    const shipping = this.calculateShipping();
    const total = subtotal + tax + shipping;

    return {
      subtotal,
      tax,
      shipping,
      total,
    };
  }

  calculateShipping() {
    const itemCount = this.itemCount();
    if (itemCount === 0) return 0;
    return 10 + Math.max(0, itemCount - 1) * 2;
  }

  formDataToJSON(form) {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
  }

  async checkout(form) {
    const items = this.getItems();
    const totals = this.calculateOrderTotal();
    const formData = this.formDataToJSON(form);

    const payload = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.exp,
      code: formData.cvv,
      items: this.packageItems(items),
      orderTotal: totals.total.toFixed(2),
      shipping: totals.shipping,
      tax: totals.tax.toFixed(2),
    };

    const externalServices = new ExternalServices();
    return externalServices.checkout(payload);
  }
}
