require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = process.env.MNENOMIC;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
      from:"0x9D8c5C498EdB020a4704DE0B7CFB2C30d6c24630"
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
