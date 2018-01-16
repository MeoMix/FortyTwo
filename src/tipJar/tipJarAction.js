const axios = require('axios');

module.exports = class TipJarAction {

  constructor(){
    this.bitcoinAddress = `12Y1qy7EXPuxkroEcdvErifb4vxFMbdc2Y`;
    this.ethereumAddress = `0x371a4aEc54a79aF62648BC785e489F3E5dd35A63`;
    this.etherscanApiKey = `P79J37ZTY38737KZYPK1528EBR4DURFFZK`;
  }

  async validate() {
  }

  async execute() {
    const bitcoinResponse = await axios.get(`https://blockchain.info/q/getreceivedbyaddress/${this.bitcoinAddress}`);
    const bitcoinReceived = bitcoinResponse.data;

    // TODO: This is showing balance not total received.
    const ethereumResponse = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${this.ethereumAddress}&tag=latest&apikey=${this.etherscanApiKey}`);
    const ethereumReceived = ethereumResponse.data.result;

    const header = `:four_leaf_clover::moneybag::four_leaf_clover:  **Tip Jar**  :four_leaf_clover::moneybag::four_leaf_clover:`;
    const bitcoinMessage = `**Bitcoin:** \`${this.bitcoinAddress} (Received: ${bitcoinReceived}BTC)\``;
    const ethereumMessage = `**Ethereum:** \`${this.ethereumAddress} (Received: ${ethereumReceived}ETH)\``;
    return `${header}\n\n${bitcoinMessage}\n${ethereumMessage}`;
  }

};