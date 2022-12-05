require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = process.env.MNENOMIC;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
      from:"0x99d24C766EB55e74381d0ac6d6BC59577905eCD7"
    }
  },
  compilers: {
    solc: {
      version: '0.8.7',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
