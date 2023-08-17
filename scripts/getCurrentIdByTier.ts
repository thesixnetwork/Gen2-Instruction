const Web3 = require('web3');
const contractAbi = require('../artifacts/contracts/TechSauce.sol/TechSauce.json');

const contractAddress = '0x40df0C834CE7549e9234D11525aD1f7E7CF48E88'; // replace with your contract address

// create a new web3 instance
const web3 = new Web3('https://sixnet-rpc-evm.sixprotocol.net:443'); // replace with your Infura project ID

// create a new contract instance
const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);

// call a contract function
contract.methods.getCurrentTokenIdByTier("STAFF").call((error:any, result:any) => {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
  }
});

