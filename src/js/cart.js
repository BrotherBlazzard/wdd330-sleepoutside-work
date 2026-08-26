import { getLocalStorage, loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

function cartItemTemplate(item) {
  const image = item.Images?.PrimaryMedium || item.Image;
  const name = item.NameWithoutBrand || item.Name;
  const color = item.Colors?.[0]?.ColorName || 'Standard color';
  const quantity = Number(item.quantity ?? 1);
  const price = Number(item.FinalPrice ?? item.price ?? 0);

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${image}" alt="${name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${name}</h2>
      </a>
      <p class="cart-card__color">${color}</p>
      <p class="cart-card__quantity">qty: ${quantity}</p>
      <p class="cart-card__price">$${(price * quantity).toFixed(2)}</p>
    </li>
  `;
}

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const productList = document.querySelector('.product-list');

  if (!productList) return;

  if (cartItems.length === 0) {
    productList.innerHTML = '<li>Your cart is empty.</li>';
    const footer = document.querySelector('.list-footer');
    if (footer) footer.classList.add('hide');
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join('');

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.FinalPrice ?? item.price ?? 0);
    const quantity = Number(item.quantity ?? 1);
    return sum + price * quantity;
  }, 0);

  const footer = document.querySelector('.list-footer');
  if (footer) {
    footer.classList.remove('hide');
    footer.querySelector('.list-total').textContent = `$${total.toFixed(2)}`;
  }
}

renderCartContents();
