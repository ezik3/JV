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

  async setupTrustline(account, issuer, currency, limit) {
    const tx = {
      TransactionType: "TrustSet",
      Account: account,
      LimitAmount: {
        currency: currency,
        issuer: issuer,
        value: limit.toString()
      }
    };

    try {
      const prepared = await this.client.autofill(tx);
      prepared.LastLedgerSequence = prepared.LastLedgerSequence + 1000; // Increase the window
      const wallet = xrpl.Wallet.fromSeed(process.env.XRP_ISSUER_SECRET);
      const signed = wallet.sign(prepared);
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log("Trustline setup result:", result);
      return result;
    } catch (error) {
      console.error("Error setting up trustline:", error);
      throw error;
    }
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

  async transferToken(sender, receiver, currency, value, issuer) {
    const tx = {
      TransactionType: 'Payment',
      Account: sender,
      Destination: receiver,
      Amount: {
        currency: currency,
        value: value,
        issuer: issuer
      }
    };

    const prepared = await this.client.autofill(tx);
    // In a real-world scenario, you'd sign this with the sender's secret
    // const wallet = xrpl.Wallet.fromSeed(senderSecret);
    // const signed = wallet.sign(prepared);
    // const result = await this.client.submitAndWait(signed.tx_blob);
    // return result;
  }

  async retryTransaction(txFunction, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await txFunction();
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.message);
        if (attempt === maxAttempts) throw error;
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }
  }

  async createStablecoin(receiver, amount) {
    console.log(`Creating ${amount} stablecoins for ${receiver}`);
    const issuer = process.env.XRP_ISSUER_ADDRESS;

    return this.retryTransaction(async () => {
      // Setup trustline first
      await this.setupTrustline(receiver, issuer, "USD", amount);

      const tx = {
        TransactionType: "Payment",
        Account: issuer,
        Destination: receiver,
        Amount: {
          currency: "USD",
          value: amount.toString(),
          issuer: issuer
        }
      };

      const prepared = await this.client.autofill(tx);
      prepared.LastLedgerSequence = prepared.LastLedgerSequence + 1000;
      const wallet = xrpl.Wallet.fromSeed(process.env.XRP_ISSUER_SECRET);
      const signed = wallet.sign(prepared);
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log("Stablecoin created:", result);
      return result;
    });
  }

  // New method for creating JV Coins
  async createJVCoin(receiver, amount) {
    console.log(`Creating ${amount} JV Coins for ${receiver}`);
    const issuer = process.env.XRP_ISSUER_ADDRESS;

    return this.retryTransaction(async () => {
      // Setup trustline first
      await this.setupTrustline(receiver, issuer, "JVC", amount);

      const tx = {
        TransactionType: "Payment",
        Account: issuer,
        Destination: receiver,
        Amount: {
          currency: "JVC",
          value: amount.toString(),
          issuer: issuer
        }
      };

      const prepared = await this.client.autofill(tx);
      prepared.LastLedgerSequence = prepared.LastLedgerSequence + 1000;
      const wallet = xrpl.Wallet.fromSeed(process.env.XRP_ISSUER_SECRET);
      const signed = wallet.sign(prepared);
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log("JV Coin created:", result);
      return result;
    });
  }

  async mintNFT(cityData) {
    const transactionBlob = {
      TransactionType: "NFTokenMint",
      Account: process.env.XRP_ISSUER_ADDRESS,
      URI: xrpl.convertStringToHex(JSON.stringify(cityData)),
      Flags: 8,
      TransferFee: 1000, // 10% royalty fee
      NFTokenTaxon: 0
    };

    try {
      const wallet = xrpl.Wallet.fromSeed(process.env.XRP_ISSUER_SECRET);
      const prepared = await this.client.autofill(transactionBlob);
      const signed = wallet.sign(prepared);
      const result = await this.client.submitAndWait(signed.tx_blob);
      console.log("NFT minted:", result);
      return result;
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  }

  async verifyJVCoinBalance(address, amount) {
    try {
      const accountLines = await this.client.request({
        command: "account_lines",
        account: address,
        peer: process.env.XRP_ISSUER_ADDRESS
      });

      const jvcBalance = accountLines.result.lines.find(
        line => line.currency === 'JVC'
      );

      return jvcBalance && parseFloat(jvcBalance.balance) >= amount;
    } catch (error) {
      console.error("Error verifying JVC balance:", error);
      throw error;
    }
  }
}

module.exports = new XRPService();