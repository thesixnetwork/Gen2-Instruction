# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## To compile the contracts

```shell
npx hardhat compile
```

## To run the tests:

```shell
npx hardhat test
```

## To deploy the contract to the Rinkeby testnet

```shell
npx hardhat run scripts/deploy.ts --network fivenet
```

## Try to verify the contract on Etherscan or other block explorer

```shell
npx hardhat verify --network fivenet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```
