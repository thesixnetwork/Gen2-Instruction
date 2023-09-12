import hardhat, { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config();

const AddressKlang = "0x1CC2Ba5d7183E8Bc0AE095a6EBfd4ed949edB3E8";
const deployedContractAddress = process.env.CONTRACT_ADDRESS!
let txn;
let hash;

async function main() {
  const factory = await ethers.getContractFactory("MyNFT");
  const contract = await factory.attach(deployedContractAddress);

  let base_uri;
  base_uri = "https://gen2-api.sixprotocol.com/api/nft/metadata/TechSauce.GlobalSummit2023/"
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