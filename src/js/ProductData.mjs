const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

function normalizeProductList(data) {
  if (Array.isArray(data)) {
    return data;
  }
  return data?.Result ?? [];
}

export default class ProductData {
  constructor() {
    // this.category = category;
    // this.path = `../public/json/${this.category}.json`;
  }
  async getData(category) {
    if (!baseURL) {
      throw new Error('VITE_SERVER_URL is not configured.');
    }

    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return normalizeProductList(data);
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}