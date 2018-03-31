//Modifying the deployment(migration) of the contract

// load our chainlist.sol from the current directory, deployed by the migration source directory
var ChainList = artifacts.require("./ChainList.sol");
//creates the variable ChainList = to the chainlist.sol contract
module.exports = function(deployer) {
  // deployer deploys the contract
  deployer. deploy(ChainList);

}
