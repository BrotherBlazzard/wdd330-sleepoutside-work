const checkoutURL = 'https://wdd330-backend.onrender.com:3000/checkout';

export default class ExternalServices {
  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(checkoutURL, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Unable to process order.');
    }

    return data;
  }
}
