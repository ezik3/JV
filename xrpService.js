const xrpl = require('xrpl');

class XRPService {
  constructor() {
    this.client = new xrpl.Client('wss://s.altnet.rippletest.net:51233'); // Use testnet for now
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async getAccountInfo(address) {
    return await this.client.request({
      command: 'account_info',
      account: address,
      ledger_index: 'validated'
    });
  }

  async createToken(issuer, currency, value, receiver) {
    const tx = {
      TransactionType: 'Payment',
      Account: issuer,
      Destination: receiver,
      Amount: {
        currency: currency,
        value: value,
        issuer: issuer
      }
    };

    const prepared = await this.client.autofill(tx);
    // You would sign the transaction here with the issuer's secret
    // const signed = wallet.sign(prepared);
    // const result = await this.client.submitAndWait(signed.tx_blob);
    // return result;
  }

  // Add more methods as needed for your stable coin operations
}

module.exports = new XRPService();
