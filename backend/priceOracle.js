class PriceOracle {
  constructor() {
    this.price = 1.00; // Starting at 1 USD
  }

  getCurrentPrice() {
    // Simulate price fluctuations
    this.price += (Math.random() - 0.5) * 0.01;
    return this.price;
  }
}

module.exports = new PriceOracle();
