import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="../product_pages/index.html?product=${product.Id}">
        <img src="${product.Image}" alt="${product.NameWithoutBrand}" />
      <h3>${product.Brand.Name}</h3>
      <p>${product.FinalPrice}</p>
      <p>View Details</p>
      </a>
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
    this.productList = await this.dataSource.getData();
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