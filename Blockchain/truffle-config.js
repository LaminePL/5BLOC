module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
      from:"0xda5c6d7a419ffEE940724Db93F95a852588fD8c4" // changer cette adresse avec votre adresse du compte admin 
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
