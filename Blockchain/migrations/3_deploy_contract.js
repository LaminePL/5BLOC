var contract_name = artifacts.require('Purchase');

module.exports = function (deployer) {  
deployer.deploy(contract_name); 
};