const axios = require('axios');

module.exports = class TipJarCommand {

  constructor(){
    this.bitcoinAddress = `12Y1qy7EXPuxkroEcdvErifb4vxFMbdc2Y`;
    this.ethereumAddress = `0x371a4aEc54a79aF62648BC785e489F3E5dd35A63`;
    this.etherscanApiKey = `P79J37ZTY38737KZYPK1528EBR4DURFFZK`;
  }

  async execute() {
    const bitcoinResponse = await axios.get(`https://blockchain.info/q/getreceivedbyaddress/${this.bitcoinAddress}`);
    const bitcoinReceived = bitcoinResponse.data;

    // TODO: This is showing balance not total received.
    const ethereumResponse = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${this.ethereumAddress}&tag=latest&apikey=${this.etherscanApiKey}`);
    const ethereumReceived = ethereumResponse.data.result;

    return {
      embed: {
        author: {
          name: `Tip Jar`
        },
        description: `Help fund the continued development of FortyTwo! Servers are ~$50/mo to run.`,
        color: 0x4CAF50,
        fields: [
          {
            name: `:moneybag: **Bitcoin** :moneybag:`,
            value: `Address: **${this.bitcoinAddress}**\nReceived: ${bitcoinReceived} BTC`
          },
          {
            name: `:four_leaf_clover: **Ethereum** :four_leaf_clover:`,
            value: `Address: **${this.ethereumAddress}**\nReceived: ${Number(ethereumReceived)/Math.pow(10, 18)} ETH`
          }
        ],
        footer: {
          text: `Thank you for your support`
        }
      }
    };
  }

};