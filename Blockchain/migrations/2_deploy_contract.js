const Card = artifacts.require("Card");
const contract_name = artifacts.require('Purchase');

module.exports = function(deployer) {
  deployer.deploy(Card);
  deployer.deploy(contract_name);
};
