import hardhat, { ethers } from "hardhat";

const Tier = {
  VIP : "VIP",
  SPEAKER : "SPEAKER",
  INVESTOR : "INVESTOR",
  PARTNER : "PARTNER",
  MEDIA: "MEDIA",
  EXHIBITOR: "EXHIBITOR",
  GENERAL: "GENERAL",
}

async function transferMultiToken(
  contractAddress: string,
  attedeeAddresss: string[],
  tiers: string[]
) {

  // check if tier is valid
  for (let i = 0; i < tiers.length; i++) {
    if (!Object.values(Tier).includes(tiers[i])) {
      throw new Error("Invalid tier");
    }
  }

  const [owner] = await ethers.getSigners();
  const contract = await ethers.getContractAt("TechSauce", contractAddress);

  let txn;
  let hash;
  txn = await contract.transferMultipleTokens(attedeeAddresss,tiers); // to , tier
  hash = await txn.wait();
  console.log(
    `Transfer to attendee success!!!`,
    hash.transactionHash,
    "tx",
    txn
  );
}

transferMultiToken(
  "0x7b70BAc782B1509de817F3552A145B12379aCbe8",
  ["0xb90b75aC68C466Bde2a0BDDde7b86897c8FE7C36","0xb90b75aC68C466Bde2a0BDDde7b86897c8FE7C36","0xb90b75aC68C466Bde2a0BDDde7b86897c8FE7C36"],
  ["VIP","VIP","VIP"]
)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
