module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
      from:"0x5c6542227b90cdFa8Efc3d765508A4460FB2aA7C"
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
