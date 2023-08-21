import hardhat, { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config();


async function main() {
  const factory = await ethers.getContractFactory("MyNFT");
  const [owner] = await ethers.getSigners();
  const contract = await factory.deploy(); // using true for mocking mocking  test
  
  await contract.deployed();

  console.log("Contract deployed to: ", contract.address);
  console.log("Contract deployed by (Owner): ", owner.address, "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });