import { getLocalStorage, loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkout = new CheckoutProcess();
const cartItems = getLocalStorage('so-cart') || [];

function updateSummary() {
  const totals = checkout.calculateOrderTotal();
  const itemCount = checkout.itemCount();

  document.querySelector('#numberItems').textContent = itemCount;
  document.querySelector('#cartTotal').textContent = `$${totals.subtotal.toFixed(2)}`;
  document.querySelector('#shipping').textContent = `$${totals.shipping.toFixed(2)}`;
  document.querySelector('#tax').textContent = `$${totals.tax.toFixed(2)}`;
  document.querySelector('#total').textContent = `$${totals.total.toFixed(2)}`;
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const form = document.forms.checkout;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  checkout
    .checkout(form)
    .then(() => {
      localStorage.removeItem('so-cart');
      form.reset();
      alert('Order submitted successfully!');
      window.location.href = '../index.html';
    })
    .catch((error) => {
      alert(error.message || 'There was a problem submitting your order.');
    });
}

if (cartItems.length > 0) {
  updateSummary();
} else {
  document.querySelector('#numberItems').textContent = '0';
  document.querySelector('#cartTotal').textContent = '$0.00';
  document.querySelector('#shipping').textContent = '$0.00';
  document.querySelector('#tax').textContent = '$0.00';
  document.querySelector('#total').textContent = '$0.00';
}

const form = document.querySelector('form[name="checkout"]');
if (form) {
  form.addEventListener('submit', handleCheckoutSubmit);
}

const zipInput = document.querySelector('#zip');
if (zipInput) {
  zipInput.addEventListener('blur', updateSummary);
}
