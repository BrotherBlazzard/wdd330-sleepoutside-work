import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const imageUrl = product.Images?.PrimaryMedium || product.Image;
  const brandName = product.Brand?.Name || '';
  return `
    <li class="product-card">
      <img src="${imageUrl}" alt="${product.Name}" />
      <h3>${brandName}</h3>
      <p>${product.NameWithoutBrand}</p>
      <p class="product-card_price">$${product.FinalPrice}</p>
      <p><a class="view-details" href="../product_pages/index.html?product=${product.Id}">View Details</a></p>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    this.productList = await this.dataSource.getData(this.category);
    this.renderList();
    document.querySelector('.title').textContent = this.category;
  }

  renderList() {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      this.productList,
      'afterbegin',
      true,
    );
  }
}