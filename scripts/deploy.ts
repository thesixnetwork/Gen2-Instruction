import hardhat, { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config();

const AddressKlang = "0x1CC2Ba5d7183E8Bc0AE095a6EBfd4ed949edB3E8";

async function main() {
  const factory = await ethers.getContractFactory("TechSauce");
  const [owner] = await ethers.getSigners();
  const contract = await factory.deploy(); // using true for mocking mocking  test
  
  await contract.deployed();

  console.log("Contract deployed to: ", contract.address);
  console.log("Contract deployed by (Owner): ", owner.address, "\n");

  let txn;
  let hash;
  txn = await contract.setPreMinteeAddress(AddressKlang);
  hash = await txn.wait();
  console.log(`Set Premint to ${AddressKlang} success!!!  at: `, hash.transactionHash)

  let base_uri;
  base_uri = "https://ipfsgw.sixnetwork.io/ipfs/QmZvQMoiZzLdcdFAoWYj8tMchZNsyL3qMBKmxjUU164ibL/"
  txn = await contract.setBaseURI(base_uri);
  hash = await txn.wait();
  console.log(`Set Base URI to ${base_uri} success!!!  at: `, hash.transactionHash)

  // premint 500 nfts if mocking is false
  let nftNumber;
  let round_floor;
  nftNumber = 7880;
  round_floor = 50;
  
  const round = Math.floor(nftNumber / round_floor);
  const remain = nftNumber % round_floor;
  let minted = 0;
  if (nftNumber > round_floor) {
    for (let i = 0; i < round; i++) {
      txn = await contract.preMint(round_floor);
      hash = await txn.wait();
      minted += round_floor;
      console.log(`Premint ${minted} nfts success!!!  at: `, hash.transactionHash)
    }
  }
  if (remain > 0 && minted < nftNumber && remain < round_floor) {
    txn = await contract.preMint(remain);
    hash = await txn.wait();
    minted += remain;
    console.log(`Premint ${remain} nfts success!!!  at: `, hash.transactionHash)
  }

  // transfer owner
  txn = await contract.transferOwnership(AddressKlang);
  hash = await txn.wait();
  console.log(`Transfer ownership to ${AddressKlang} success!!!  at: `, hash.transactionHash,)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });