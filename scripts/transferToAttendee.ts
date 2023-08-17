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

async function transferToAttendee(
  contractAddress: string,
  attedeeAddress: string,
  tier: string
) {
  // check if tier is valid
  if (!Object.values(Tier).includes(tier)) {
    throw new Error("Invalid tier");
  }

  const [owner] = await ethers.getSigners();
  const contract = await ethers.getContractAt("TechSauce", contractAddress);

  let txn;
  let hash;
  txn = await contract.TransferByTier(attedeeAddress,tier); // to , tier
  hash = await txn.wait();
  console.log(
    `Transfer to attendee success!!!`,
    hash.transactionHash,
    "tx",
    txn
  );
}

transferToAttendee(
  "0xe093f1A6a4D3268e58E0edbD7587997a9C9a1e32",
  "0xb90b75aC68C466Bde2a0BDDde7b86897c8FE7C36",
  "VIP"
)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
