const xrpl = require('xrpl');

class VibeToken {
  constructor() {
    this.client = null;
    this.issuerWallet = null;
  }

  async initialize() {
    this.client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await this.client.connect();
    
    // Create or load your issuer wallet
    this.issuerWallet = xrpl.Wallet.generate();
    
    // Fund the issuer account (for testnet)
    const fund_result = await this.client.fundWallet(this.issuerWallet);
    console.log('Issuer wallet funded:', fund_result);
  }

  async issueToken(amount, receiverAddress) {
    const trustSetTx = {
      "TransactionType": "TrustSet",
      "Account": receiverAddress,
      "LimitAmount": {
        "currency": "VIBE",
        "issuer": this.issuerWallet.address,
        "value": amount.toString()
      }
    };

    const payment = {
      "TransactionType": "Payment",
      "Account": this.issuerWallet.address,
      "Destination": receiverAddress,
      "Amount": {
        "currency": "VIBE",
        "value": amount.toString(),
        "issuer": this.issuerWallet.address
      }
    };

    return { trustSetTx, payment };
  }
}

module.exports = new VibeToken();
