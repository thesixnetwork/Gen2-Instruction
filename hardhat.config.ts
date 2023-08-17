import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from "dotenv";
dotenv.config();

const getHDWallet = () => {
  const { PRIVATE_KEY } = process.env;
  if (PRIVATE_KEY && PRIVATE_KEY !== "") {
    return [PRIVATE_KEY]
  }
  throw Error("Private Key Not Set! Please set up .env");
}

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
      accounts: getHDWallet(),
      gas: "auto",
      allowUnlimitedContractSize: true,
      blockGasLimit: 10000000,
    },
    baobab: {
      url: `https://api.baobab.klaytn.net:8651`,
      accounts: getHDWallet(),
      gas: "auto",
      allowUnlimitedContractSize: true,
      blockGasLimit: 10000000,
    },
    fivenet: {
      url: "https://rpc-evm.fivenet.sixprotocol.net:443",
      accounts:getHDWallet(),
      gas: "auto",
      allowUnlimitedContractSize: true,
      blockGasLimit: 10000000,
    },
    sixnet: {
      url: "https://sixnet-rpc-evm.sixprotocol.net:443",
      accounts:getHDWallet(),
      gas: "auto",
      allowUnlimitedContractSize: true,
      blockGasLimit: 10000000,
    },    
    local: {
      url: "http://localhost:8545",
      accounts:getHDWallet(),
      gas: "auto",
      allowUnlimitedContractSize: true,
      blockGasLimit: 10000000,
    },
    scrollAlpha: {
      url: "https://alpha-rpc.scroll.io/l2",
      accounts:getHDWallet(),
      gas: "auto",
      allowUnlimitedContractSize: true,
      blockGasLimit: 10000000,
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY?  process.env.ETHERSCAN_API_KEY: "",
      fivenet: "your API key",
      sixnet: "your API key",
      scrollAlpha: 'abc',
    },
    customChains: [
      {
        network: "fivenet",
        chainId: 150,
        urls: {
          apiURL: "https://fivenet.evm.sixscan.io/api",
          browserURL: "https://fivenet.evm.sixscan.io/",
        },
      },
      {
        network: "sixnet",
        chainId: 98,
        urls: {
          apiURL: "https://evm.sixscan.io/api",
          browserURL: "https://evm.sixscan.io/",
        },
      },
      {
        network: "scrollAlpha",
        chainId: 534353,
        urls: {
          apiURL: 'https://blockscout.scroll.io/api',
          browserURL: 'https://blockscout.scroll.io/',
        },
      },
    ],
  }
};

export default config;
